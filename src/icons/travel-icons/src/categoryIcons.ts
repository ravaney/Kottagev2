import type { ComponentType } from "react";
import type { TravelIconProps } from "./types";
import {
  MusicIcon,
  LiveMusicIcon,
  FoodDrinkIcon,
  BusinessIcon,
  CultureIcon,
  WellnessIcon,
  NightlifeIcon,
  PartyIcon,
  FamilyIcon,
  VillaIcon,
  CalendarEventIcon,
  TicketIcon,
  RestaurantIcon,
  CouponIcon,
  NomadIcon,
  ExtendedStayIcon,
} from "./index";

export const categoryIcons: Record<
  string,
  ComponentType<TravelIconProps>
> = {
  Music: MusicIcon,
  "Live Music": LiveMusicIcon,
  "Food & Drink": FoodDrinkIcon,
  Business: BusinessIcon,
  Culture: CultureIcon,
  Wellness: WellnessIcon,
  Nightlife: NightlifeIcon,
  Parties: PartyIcon,
  Family: FamilyIcon,
  Villas: VillaIcon,
  Events: CalendarEventIcon,
  Tickets: TicketIcon,
  Restaurants: RestaurantIcon,
  Coupons: CouponIcon,
  Nomad: NomadIcon,
  "Extended Stay": ExtendedStayIcon,
};
