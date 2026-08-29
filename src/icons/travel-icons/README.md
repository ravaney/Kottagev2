# Travel Icons — Approved Flat Style

This pack contains the 41 travel/lifestyle icons from the approved visual set.

## Recommended placement

Copy the folder into:

```text
src/
  icons/
    travel/
```

A clean final structure is:

```text
src/icons/travel/
  icons/
  IconBase.tsx
  types.ts
  index.ts
  categoryIcons.ts
```

## Usage

```tsx
import {
  VillaIcon,
  ConcertIcon,
  RestaurantIcon,
  NomadIcon,
  NightlifeIcon,
} from "@/icons/travel";

export function Example() {
  return (
    <>
      {/* approved default purple */}
      <VillaIcon size={28} />

      {/* same artwork, automatic green shades */}
      <ConcertIcon size={28} color="#16A34A" />

      {/* any CSS color works */}
      <NightlifeIcon size={28} color="royalblue" />
      <NomadIcon size={28} color="var(--brand-color)" />
    </>
  );
}
```

## Color behavior

Default base color:

```text
#6F42D8
```

The component generates:

- primary = supplied color
- light = supplied color mixed with white
- dark = supplied color mixed with black

Each icon uses at most three shades and no gradients.

## Included raw SVG files

The `svg/` folder contains standalone SVG versions using the default purple palette.
The React components in `src/icons/` are the dynamic-color versions.
