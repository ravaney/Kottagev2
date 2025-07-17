import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

// Hook for calling Cloud Functions
export const useCloudFunctions = () => {
  
  // Create property function
  const createProperty = async (propertyData: any) => {
    const createPropertyFn = httpsCallable(functions, 'createProperty');
    try {
      const result = await createPropertyFn(propertyData);
      return result.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  };

  // Get user properties function
  const getUserProperties = async () => {
    const getUserPropertiesFn = httpsCallable(functions, 'getUserProperties');
    try {
      const result = await getUserPropertiesFn();
      return result.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  };

  // Hello world test function
  const testHelloWorld = async () => {
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://us-central1-kottage-v2.cloudfunctions.net'}/helloWorld`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error calling hello world:', error);
      throw error;
    }
  };

  return {
    createProperty,
    getUserProperties,
    testHelloWorld
  };
};