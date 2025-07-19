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
import { useMediaQuery, useTheme } from "@mui/material";
import style from "../../styles/Splash.module.css";
import { MdOutlineExplore } from "react-icons/md";
export default function CommandMenu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  registerIcons({
    icons: {
      MdHolidayVillage: <MdHolidayVillage />,
      MdModeOftravel: <MdModeOfTravel />,
      GiPartyFlags: <GiPartyFlags />,
      EatDrink: <EatDrink />,
      Car: <Car />,
      Backpackers: <Backpackers />,
      ExploreIcon: <MdOutlineExplore />,
    },
  });

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
  
  const getItemStyle = () => ({
    fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
    fontWeight: "bold",
    padding: isMobile ? "8px 12px" : "12px 16px",
  });
  
  const getIconSize = () => isMobile ? "16px" : "20px";
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
            height: 60,
          },
        }}
        //shrink as the screen size shrinks
        farItems={isMobile ? [] : [
          {
            key: "Restaurants",
            text: isTablet ? "Eat" : "Restaurants",
            style: getItemStyle(),
            iconProps: {
              iconName: "EatDrink",
              styles: {
                root: {
                  color: Colors.blue,
                  fontSize: getIconSize(),
                },
              },
            },
            onClick: () => navigateToRoute("/Restaurants"),
            className: checkRoute("/Restaurants"),
          },
          {
            key: "Car Rentals",
            text: isTablet ? "Cars" : "Car Rentals",
            style: getItemStyle(),
            iconProps: {
              iconName: "Car",
              styles: {
                root: {
                  color: Colors.blue,
                  fontSize: getIconSize(),
                },
              },
            },
            onClick: () => navigateToRoute("/CarRentals"),
            className: checkRoute("/CarRentals"),
          },
        ]}
        items={[
          {
            key: "Explore",
            text: "Explore",
            style: getItemStyle(),
            iconProps: {
              iconName: "ExploreIcon",
              styles: {
                root: {
                  color: Colors.blue,
                  fontSize: getIconSize(),
                },
              },
            },
            onClick: () => {
              navigateToRoute("/Explore");
            },
            className: checkRoute("/Explore"),
          },
          {
            key: "Excursions",
            text: isMobile ? "Tours" : "Excursions",
            style: getItemStyle(),
            iconProps: {
              iconName: "MdModeOfTravel",
              styles: {
                root: {
                  color: Colors.blue,
                  fontSize: getIconSize(),
                },
              },
            },
            onClick: () => navigateToRoute("/Excursions"),
            className: checkRoute("/Excursions"),
          },
          {
            key: "Events",
            text: "Events",
            style: getItemStyle(),
            iconProps: {
              iconName: "GiPartyFlags",
              styles: {
                root: {
                  color: Colors.blue,
                  fontSize: getIconSize(),
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
