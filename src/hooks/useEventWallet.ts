import React from 'react';
import { get, onValue, ref, set } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from './useAuth';
import {
  emptyEventWallet,
  EventWalletRecord,
  getEventWalletCount,
  hasLegacyEventWalletData,
  mergeEventWallets,
  normalizeEventWallet,
  readLegacyEventWallet,
  serializeEventWallet,
  StoredEventTicketOrder,
  clearLegacyEventWalletStorage,
} from '../utils/eventWalletStorage';

const getEventWalletPath = (uid: string) => `users/${uid}/eventWallet`;

export const useEventWallet = () => {
  const { uid, loading: authLoading } = useAuth();
  const [wallet, setWallet] = React.useState<EventWalletRecord>(emptyEventWallet);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    if (authLoading) {
      setLoading(true);
      return () => undefined;
    }

    if (!uid) {
      setWallet(emptyEventWallet);
      setLoading(false);
      setError(null);
      return () => undefined;
    }

    const walletRef = ref(database, getEventWalletPath(uid));

    const bootstrapWallet = async () => {
      try {
        const snapshot = await get(walletRef);
        const remoteWallet = normalizeEventWallet(snapshot.val());
        const legacyWallet = readLegacyEventWallet();
        const mergedWallet = mergeEventWallets(remoteWallet, legacyWallet);

        if (!active) {
          return;
        }

        setWallet(mergedWallet);
        setLoading(false);
        setError(null);

        if (hasLegacyEventWalletData()) {
          await set(walletRef, serializeEventWallet(mergedWallet));
          clearLegacyEventWalletStorage();
        }

        unsubscribe = onValue(
          walletRef,
          liveSnapshot => {
            if (!active) {
              return;
            }

            setWallet(normalizeEventWallet(liveSnapshot.val()));
            setLoading(false);
            setError(null);
          },
          subscriptionError => {
            if (!active) {
              return;
            }

            setError(subscriptionError.message || 'Unable to sync event wallet.');
            setLoading(false);
          }
        );
      } catch (walletError) {
        if (!active) {
          return;
        }

        const message =
          walletError instanceof Error
            ? walletError.message
            : 'Unable to load event wallet.';

        setError(message);
        setWallet(emptyEventWallet);
        setLoading(false);
      }
    };

    void bootstrapWallet();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [authLoading, uid]);

  const persistWallet = React.useCallback(
    async (updater: (currentWallet: EventWalletRecord) => EventWalletRecord) => {
      if (!uid) {
        throw new Error('AUTH_REQUIRED');
      }

      const walletRef = ref(database, getEventWalletPath(uid));
      const snapshot = await get(walletRef);
      const remoteWallet = normalizeEventWallet(snapshot.val());
      const currentWallet = hasLegacyEventWalletData()
        ? mergeEventWallets(remoteWallet, readLegacyEventWallet())
        : remoteWallet;
      const nextWallet = updater(currentWallet);

      await set(walletRef, serializeEventWallet(nextWallet));

      if (hasLegacyEventWalletData()) {
        clearLegacyEventWalletStorage();
      }

      return nextWallet;
    },
    [uid]
  );

  const toggleSavedCoupon = React.useCallback(
    async (eventId: string) => {
      const nextWallet = await persistWallet(currentWallet => {
        const hasCoupon = currentWallet.savedCouponIds.includes(eventId);
        return {
          ...currentWallet,
          savedCouponIds: hasCoupon
            ? currentWallet.savedCouponIds.filter(id => id !== eventId)
            : [...currentWallet.savedCouponIds, eventId],
        };
      });

      return nextWallet.savedCouponIds;
    },
    [persistWallet]
  );

  const removeSavedCoupon = React.useCallback(
    async (eventId: string) => {
      const nextWallet = await persistWallet(currentWallet => ({
        ...currentWallet,
        savedCouponIds: currentWallet.savedCouponIds.filter(id => id !== eventId),
      }));

      return nextWallet.savedCouponIds;
    },
    [persistWallet]
  );

  const saveTicketOrder = React.useCallback(
    async (order: StoredEventTicketOrder) => {
      const nextWallet = await persistWallet(currentWallet => ({
        ...currentWallet,
        ticketOrders: [...currentWallet.ticketOrders, order],
      }));

      return nextWallet.ticketOrders;
    },
    [persistWallet]
  );

  return {
    wallet,
    savedCouponIds: wallet.savedCouponIds,
    ticketOrders: wallet.ticketOrders,
    totalCount: getEventWalletCount(wallet),
    loading: authLoading || loading,
    error,
    isAuthenticated: !!uid,
    toggleSavedCoupon,
    removeSavedCoupon,
    saveTicketOrder,
  };
};
