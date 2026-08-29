# Travel Icons React — Flat Shade Edition

Custom flat React + TypeScript SVG icons for a travel / hospitality app.

## Color behavior

Default base color:

`#6D42D8`

Every icon uses at most three shades of the same base color:
- primary
- automatically generated lighter shade
- automatically generated darker shade

There are no gradients.

## Usage

```tsx
import {
  VillaIcon,
  NightlifeIcon,
  CouponIcon,
  NomadIcon,
} from "./icons/travel-icons-react/src";

export function Example() {
  return (
    <>
      <VillaIcon size={28} />
      <NightlifeIcon size={28} color="green" />
      <CouponIcon size={28} color="#0EA5E9" />
      <NomadIcon size={28} color="var(--brand-color)" />
    </>
  );
}
```

Any valid CSS color works:

```tsx
<VillaIcon color="green" />
<VillaIcon color="#16a34a" />
<VillaIcon color="rgb(22 163 74)" />
<VillaIcon color="hsl(142 71% 45%)" />
<VillaIcon color="var(--brand-color)" />
```

The shades are derived with CSS `color-mix()`, so named colors and CSS variables work without a JavaScript color parser.

## Props

```ts
type TravelIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  size?: number | string;
  color?: string;
  title?: string;
};
```

## Icons

`VillaIcon`, `HomeIcon`, `CalendarEventIcon`, `ConcertIcon`, `TicketIcon`, `RestaurantIcon`, `FoodDrinkIcon`, `CouponIcon`, `NomadIcon`, `ExtendedStayIcon`, `MapPinIcon`, `LocationIcon`, `MapIcon`, `CompassIcon`, `PlaneIcon`, `SuitcaseIcon`, `BedIcon`, `PoolIcon`, `BeachIcon`, `WifiIcon`, `MusicIcon`, `LiveMusicIcon`, `BusinessIcon`, `CultureIcon`, `WellnessIcon`, `NightlifeIcon`, `PartyIcon`, `FamilyIcon`, `UsersIcon`, `UserIcon`, `HeartIcon`, `StarIcon`, `SearchIcon`, `FilterIcon`, `PaymentCardIcon`, `WalletIcon`, `BellIcon`, `ClockIcon`, `GlobeIcon`, `ChatIcon`, `SupportIcon`