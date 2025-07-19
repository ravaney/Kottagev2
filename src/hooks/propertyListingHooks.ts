import { useQuery } from "@tanstack/react-query";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import { Kottage } from "./propertyHooks";

export const useGetAllProperties = () => {
  return useQuery({
    queryKey: ['allProperties'],
    queryFn: async () => {
      const propertiesRef = ref(database, "properties");
      const snapshot = await get(propertiesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.entries(data).map(([id, property]) => ({
          id,
          ...(property as any)
        }));
      } else {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetFeaturedRegionProperties = (region: string) => {
  return useQuery({
    queryKey: ['featuredRegion', region],
    queryFn: async () => {
      const propertiesRef = ref(database, "properties");
      const snapshot = await get(propertiesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const properties = Object.entries(data)
          .map(([id, property]) => ({
            id,
            ...(property as any)
          }))
          .filter((property: any) => 
            property.address?.state?.toLowerCase() === region.toLowerCase() ||
            property.address?.city?.toLowerCase() === region.toLowerCase()
          );
        
        return properties.slice(0, 2); // Return only 2 properties from the region
      } else {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};