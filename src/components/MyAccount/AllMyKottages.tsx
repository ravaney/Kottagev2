import React, { useEffect } from "react";
import { useAppDispatch } from "../../state/hooks";
import { getMyPropertiesAsync } from "../../state/thunks";
import { Kottage, usePropertyState } from "../../state/propertySlice";
import PropertyCard from "../PropertyCard";
import { Stack } from "@fluentui/react";
type Props = {};

export const gap10 = { childrenGap: 10 };
export default function AllMyKottages({}: Props) {
  const dispatch = useAppDispatch();
  const { allMyProperties } = usePropertyState();

  useEffect(() => {
    dispatch(getMyPropertiesAsync());
  }, []);

  console.log(allMyProperties);

  if (!allMyProperties) {
    return <div>loading...</div>;
  }

  return (
    <Stack horizontal tokens={gap10} style={{ padding: "10px" }}>
      {allMyProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </Stack>
  );
}
