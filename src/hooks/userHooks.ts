import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, get, set, update, remove } from "firebase/database";
import { database } from "../firebase";
import { IUser } from "../../public/QuickType";

export interface UserWithStats extends IUser {
  userId: string;
  registrationDate: string;
  lastLoginDate?: string;
  totalReservations: number;
  totalSpent: number;
  isVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'pending' | 'banned';
  riskScore?: number;
}

// Hook to get all users (admin/staff use)
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.entries(data).map(([userId, user]) => ({
          userId,
          ...(user as any),
          registrationDate: (user as any).createdAt || new Date().toISOString(),
          totalReservations: 0, // Will be calculated separately
          totalSpent: 0, // Will be calculated separately
          isVerified: (user as any).emailVerified || false,
          accountStatus: (user as any).accountStatus || 'active',
          riskScore: (user as any).riskScore || 0
        })) as UserWithStats[];
      } else {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get user statistics
export const useGetUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const usersRef = ref(database, "users");
      const reservationsRef = ref(database, "reservations");
      
      const [usersSnapshot, reservationsSnapshot] = await Promise.all([
        get(usersRef),
        get(reservationsRef)
      ]);

      const users = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;
      const reservations = reservationsSnapshot.exists() ? Object.values(reservationsSnapshot.val()) : [];

      // Calculate active users (users with reservations in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeUsers = new Set();
      const totalRevenue = (reservations as any[]).reduce((sum, reservation) => {
        const createdAt = new Date(reservation.createdAt);
        if (createdAt >= thirtyDaysAgo) {
          activeUsers.add(reservation.userId);
        }
        return sum + (reservation.totalPrice || 0);
      }, 0);

      return {
        totalUsers: users,
        activeUsers: activeUsers.size,
        totalReservations: reservations.length,
        totalRevenue,
        averageReservationValue: reservations.length > 0 ? totalRevenue / reservations.length : 0
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook to update user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, {
        accountStatus: status,
        updatedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });
};

// Hook to get recent user activities
export const useGetRecentUserActivities = () => {
  return useQuery({
    queryKey: ['recentUserActivities'],
    queryFn: async () => {
      const usersRef = ref(database, "users");
      const reservationsRef = ref(database, "reservations");
      
      const [usersSnapshot, reservationsSnapshot] = await Promise.all([
        get(usersRef),
        get(reservationsRef)
      ]);

      const activities: Array<{
        id: string;
        type: 'registration' | 'booking' | 'cancellation';
        user: string;
        action: string;
        time: string;
        details?: string;
      }> = [];

      // Add recent registrations
      if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();
        Object.entries(users).forEach(([userId, user]: [string, any]) => {
          const registrationDate = new Date(user.createdAt || user.registrationDate);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          if (registrationDate >= sevenDaysAgo) {
            activities.push({
              id: `reg-${userId}`,
              type: 'registration',
              user: `${user.firstName} ${user.lastName}`,
              action: 'registered new account',
              time: getTimeAgo(registrationDate),
              details: user.email
            });
          }
        });
      }

      // Add recent bookings
      if (reservationsSnapshot.exists()) {
        const reservations = reservationsSnapshot.val();
        Object.entries(reservations).forEach(([reservationId, reservation]: [string, any]) => {
          const bookingDate = new Date(reservation.createdAt);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          if (bookingDate >= sevenDaysAgo) {
            const guestName = reservation.guests?.[0]?.name || 'Unknown Guest';
            activities.push({
              id: `booking-${reservationId}`,
              type: 'booking',
              user: guestName,
              action: reservation.status === 'cancelled' ? 'cancelled reservation' : 'made a reservation',
              time: getTimeAgo(bookingDate),
              details: reservation.property?.name || 'Unknown Property'
            });
          }
        });
      }

      // Sort by most recent first
      return activities.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      }).slice(0, 10); // Return only the 10 most recent activities
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Helper function to calculate time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
};

// Helper function to parse time ago for sorting
const parseTimeAgo = (timeAgo: string): number => {
  if (timeAgo === 'just now') return 0;
  
  const match = timeAgo.match(/(\d+)\s+(minute|hour|day|month)s?\s+ago/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'minute': return value;
    case 'hour': return value * 60;
    case 'day': return value * 60 * 24;
    case 'month': return value * 60 * 24 * 30;
    default: return 0;
  }
};
