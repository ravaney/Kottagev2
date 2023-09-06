import React from "react";
import { Label, Stack, Text } from "@fluentui/react";

export default function Policy() {
  return (
    <Stack style={{ padding: "0px 20px" }}>
      <Label>Policies</Label>
      <Text>Cancellation and Refund Policy</Text>
      <Text>
        Cancellations made 14 days or more before check in, will receive a 100%
        refund. Cancellations made within 14-7 before check in days will receive
        50% refund. Cancellations made within 7 days of check in will receive no
        refund
      </Text>
      <Text>No Smoking Policy</Text>
      <Text>
        Guest understands, acknowledges and agrees to abide by the no smoking
        policy that applies to all Kottage properties. All Kottage properties
        are completely smoke-free, including all guest rooms, resort buildings,
        common areas, patios and balconies, except for strictly designated
        smoking areas.
      </Text>
    </Stack>
  );
}
