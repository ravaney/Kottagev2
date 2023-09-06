import { Stack, CommandBar } from "@fluentui/react";
import React, { useEffect } from "react";
import { Colors } from "../constants";
import { useNavigate } from "react-router-dom";
import { MdHolidayVillage } from "react-icons/md";
import { registerIcons } from "@fluentui/react";
import { MdModeOfTravel } from "react-icons/md";
import { GiPartyFlags } from "react-icons/gi";
import { IoIosRestaurant as EatDrink } from "react-icons/io";
import { AiOutlineCar as Car } from "react-icons/ai";
import { PiBackpackThin as Backpackers } from "react-icons/pi";
import style from "../../styles/Splash.module.css";

export default function CommandMenu() {
  registerIcons({
    icons: {
      MdHolidayVillage: <MdHolidayVillage />,
      MdModeOftravel: <MdModeOfTravel />,
      GiPartyFlags: <GiPartyFlags />,
      EatDrink: <EatDrink />,
      Car: <Car />,
      Backpackers: <Backpackers />,
    },
  });

  useEffect(() => {
    const path = window.location.pathname;
    console.log(path);
  }, []);

  const checkRoute = (route: string) => {
    const path = window.location.pathname;
    if (path === route) {
      return style.activeRoute;
    } else {
      return style.commandBar;
    }
  };

  //create a function to navigate to the route
  const navigateToRoute = useNavigate();
  const gap = { childrenGap: 10 };
  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      tokens={gap}
    >
      <CommandBar
        styles={{
          root: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        //shrink as the screen size shrinks
        farItems={[
          {
            key: "Restaurants",
            text: "Restaurants",
            style: {
              fontSize: "16px",
              fontWeight: "bold",
            },
            iconProps: {
              iconName: "EatDrink",
              styles: {
                root: {
                  color: Colors.blue,
                },
              },
            },
            onClick: () => navigateToRoute("/Restaurants"),
            className: checkRoute("/Restaurants"),
          },
          {
            key: "Car Rentals",
            text: "Car Rentals",
            style: {
              fontSize: "16px",
              fontWeight: "bold",
            },
            iconProps: {
              iconName: "Car",
              styles: {
                root: {
                  color: Colors.blue,
                },
              },
            },
            onClick: () => navigateToRoute("/CarRentals"),
            className: checkRoute("/CarRentals"),
          },
          {
            key: "Backpackers",
            text: "Backpackers",
            style: {
              fontSize: "16px",
              fontWeight: "bold",
            },
            iconProps: {
              iconName: "Backpackers",
              styles: {
                root: {
                  color: Colors.blue,
                },
              },
            },
            className: checkRoute("/Backpackers"),
            onClick: () => navigateToRoute("/Backpackers"),
          },
        ]}
        items={[
          {
            key: "Kottages",
            text: "Kottages",
            style: {
              fontSize: "16px",
              fontWeight: "bold",
            },

            iconProps: {
              iconName: "MdHolidayVillage",
              styles: {
                root: {
                  color: Colors.blue,
                },
              },
            },

            onClick: () => {
              navigateToRoute("/Kottages");
            },
            className: checkRoute("/Kottages"),
          },
          {
            key: "Excursions",
            text: "Excursions ",
            style: {
              fontSize: "16px",
              fontWeight: "bold",
            },
            iconProps: {
              iconName: "MdModeOfTravel",
              styles: {
                root: {
                  color: Colors.blue,
                },
              },
            },
            onClick: () => navigateToRoute("/Excursions"),
            className: checkRoute("/Excursions"),
          },
          {
            key: "Events",
            text: "Events",
            style: {
              fontSize: "16px",
              fontWeight: "bold",
            },
            iconProps: {
              iconName: "GiPartyFlags",
              styles: {
                root: {
                  color: Colors.blue,
                },
              },
            },
            onClick: () => navigateToRoute("/Events"),
            className: checkRoute("/Events"),
          },
        ]}
      />
    </Stack>
  );
}
