import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Colors } from "../constants";

export default function PropertyNav() {
  return (
    <Container
      style={{
        // position: "sticky",
        backgroundColor: "transparent",
      }}
    >
      <Navbar
        variant="light"
        style={{
          display: "flex",
          maxWidth: "100%",
          overflow: "auto",
        }}
      >
        <Nav>
          <Nav.Link style={{ color: Colors.raspberry }} href="#about">
            About
          </Nav.Link>
          <Nav.Link style={{ color: Colors.raspberry }} href="#amenities">
            Amenities
          </Nav.Link>
          <Nav.Link style={{ color: Colors.raspberry }} href="#policy">
            Policies
          </Nav.Link>
          <Nav.Link style={{ color: Colors.raspberry }} href="#reviews">
            Reviews
          </Nav.Link>
        </Nav>
      </Navbar>
    </Container>
  );
}
