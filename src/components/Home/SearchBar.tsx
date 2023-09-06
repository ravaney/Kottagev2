import {
  DatePicker,
  Dropdown,
  PrimaryButton,
  Stack,
  TextField,
} from "@fluentui/react";

export const SearchBar = () => {
  const gap = { childrenGap: 10 };
  return (
    <Stack
      //switch to horizontal when screen size is large enough
      horizontal
      tokens={gap}
    >
      <TextField
        placeholder="Where do you want to go?"
        iconProps={{ iconName: "Search" }}
      />
      <DatePicker placeholder="Check-in" />
      <DatePicker placeholder="Check-out" />
      <Dropdown placeholder="Guests" options={[]} />
      <PrimaryButton text="Search" />
    </Stack>
  );
};
