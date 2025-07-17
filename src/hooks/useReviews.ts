import { ref, push, set } from 'firebase/database';
import { database, auth } from '../firebase';

interface ReviewData {
  rating: number; // 1-5 stars
  comment: string;
  guestName: string;
  propertyId: string;
}

export const useReviews = () => {
  
  // Add a new review
  const addReview = async (reviewData: ReviewData) => {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to add a review');
    }

    try {
      const reviewRef = ref(database, `reviews/${reviewData.propertyId}`);
      const newReviewRef = push(reviewRef);
      
      const review = {
        ...reviewData,
        userId: auth.currentUser.uid,
        createdAt: Date.now(),
        timestamp: new Date().toISOString()
      };

      await set(newReviewRef, review);
      
      return {
        success: true,
        reviewId: newReviewRef.key,
        message: 'Review added successfully'
      };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  return {
    addReview
  };
};