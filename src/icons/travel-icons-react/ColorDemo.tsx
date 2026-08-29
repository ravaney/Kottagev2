import {
  VillaIcon,
  NightlifeIcon,
  TicketIcon,
  RestaurantIcon,
  NomadIcon,
} from "./src";

export function ColorDemo() {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <VillaIcon size={42} />
      <NightlifeIcon size={42} color="green" />
      <TicketIcon size={42} color="#0EA5E9" />
      <RestaurantIcon size={42} color="#EF4444" />
      <NomadIcon size={42} color="var(--brand-color)" />
    </div>
  );
}
