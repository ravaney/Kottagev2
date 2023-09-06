import { Stack } from "@fluentui/react";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

export default function PageNotFound({}: Props) {
  return (
    //create a page not found component and a link to the home page
    <Stack horizontalAlign="center" verticalAlign="center">
      <h1>Page Not Found</h1>
      <Link to="/">Go Home</Link>
    </Stack>
  );
}
