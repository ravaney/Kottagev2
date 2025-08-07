/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from 'firebase-functions';
import { onCall } from 'firebase-functions/v2/https';
import { onValueWritten } from 'firebase-functions/v2/database';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

// Import employee management functions
export * from './employeeManagement';

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Function to calculate average rating when a review is written
export const updatePropertyRating = onValueWritten(
  {
    ref: '/reviews/{propertyId}/{reviewId}',
    region: 'us-central1',
  },
  async event => {
    const propertyId = event.params.propertyId;
    const reviewData = event.data.after.val();

    if (!reviewData || !reviewData.rating) {
      logger.warn('No rating data found in review', { propertyId });
      return;
    }

    try {
      // Get all reviews for this property
      const reviewsSnapshot = await admin
        .database()
        .ref(`reviews/${propertyId}`)
        .once('value');

      const reviews = reviewsSnapshot.val() || {};
      const reviewValues = Object.values(reviews) as any[];

      // Calculate average rating
      const totalRating = reviewValues.reduce((sum, review) => {
        return sum + (review.rating || 0);
      }, 0);

      const averageRating =
        reviewValues.length > 0
          ? Math.round((totalRating / reviewValues.length) * 10) / 10 // Round to 1 decimal
          : 0;

      const reviewCount = reviewValues.length;

      // Update property with new average rating
      await admin.database().ref(`properties/${propertyId}`).update({
        rating: averageRating,
        reviewCount: reviewCount,
        lastUpdated: admin.database.ServerValue.TIMESTAMP,
      });

      logger.info('Property rating updated', {
        propertyId,
        averageRating,
        reviewCount,
        newReviewRating: reviewData.rating,
      });
    } catch (error) {
      logger.error('Error updating property rating', {
        propertyId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

// Set Host Claims Function
export const setHostClaims = onCall({ cors: true }, async request => {
  try {
    logger.info('setHostClaims called with request:', request.data);
    logger.info('Request auth:', request.auth);

    const { uid, role } = request.data;

    if (!uid) {
      logger.error('No UID provided in request');
      throw new Error('User UID is required');
    }

    // Check if request is authenticated
    if (!request.auth) {
      logger.error('Unauthenticated request');
      throw new Error('Authentication required');
    }

    // Allow users to set claims for themselves only (or admin users)
    if (request.auth.uid !== uid) {
      // Check if the requester is an admin
      const requesterClaims = request.auth.token;
      if (
        !requesterClaims?.role ||
        !['admin', 'super_admin'].includes(requesterClaims.role)
      ) {
        logger.error('Unauthorized: User can only set claims for themselves');
        throw new Error(
          'Unauthorized: Users can only set claims for themselves'
        );
      }
    }

    logger.info('Setting host claims for user:', uid);

    const hostClaims = {
      role: role,
      userType: 'customer',
      isEmployee: false,
      isActive: true,
      hostStatus: 'pending',
      hostLevel: 'new',
    };

    logger.info('Claims to set:', hostClaims);
    await admin.auth().setCustomUserClaims(uid, hostClaims);
    logger.info('Successfully set host claims for user:', uid);

    return { success: true, message: 'Host claims set successfully' };
  } catch (error) {
    logger.error('Error setting host claims:', error);
    throw new Error(`Failed to set host claims: ${error}`);
  }
});

export const setEmployeeClaims = onCall({ cors: true }, async request => {
  try {
    logger.info('setEmployeeClaims called with request:', request.data);
    logger.info('Request auth:', request.auth);

    const { uid, employeeData } = request.data;

    if (!uid) {
      logger.error('No UID provided in request');
      throw new Error('User UID is required');
    }

    // Check if request is authenticated
    if (!request.auth) {
      logger.error('Unauthenticated request');
      throw new Error('Authentication required');
    }

    // Allow users to set claims for themselves only (or admin users)
    if (request.auth.uid !== uid) {
      // Check if the requester is an admin
      const requesterClaims = request.auth.token;
      if (
        !requesterClaims?.role ||
        !['admin', 'super_admin'].includes(requesterClaims.role)
      ) {
        logger.error('Unauthorized: User can only set claims for themselves');
        throw new Error(
          'Unauthorized: Users can only set claims for themselves'
        );
      }
    }

    logger.info('Setting employee claims for user:', uid);

    const employeeClaims = {
      role: employeeData.role,
      userType: 'employee',
      isEmployee: true,
      isActive: true,
      employeeStatus: 'active',
    };

    logger.info('Claims to set:', employeeClaims);
    await admin.auth().setCustomUserClaims(uid, employeeClaims);
    logger.info('Successfully set employee claims for user:', uid);

    return { success: true, message: 'Employee claims set successfully' };
  } catch (error) {
    logger.error('Error setting employee claims:', error);
    throw new Error(`Failed to set employee claims: ${error}`);
  }
});
