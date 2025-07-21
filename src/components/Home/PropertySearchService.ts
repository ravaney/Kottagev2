// This service has been replaced with Firebase-backed hooks
// Import the new hooks for property search functionality

export { 
  useSearchProperties, 
  usePopularProperties, 
  usePropertiesByRegion,
  useProperty,
  type SearchData, 
  type SearchFilters 
} from '../../hooks/usePropertySearch';

// Re-export Property type from SearchResults for backward compatibility
export type { Property } from './SearchResults';
