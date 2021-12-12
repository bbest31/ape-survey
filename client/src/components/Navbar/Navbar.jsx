import React, { useState } from "react";
import "./Navbar.css";
import { Container, Row, Col } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const clickHandler = (e) => {
    console.log("click", e);
  };

  return (
    <div>
      <div className="navbar">
        <div className="menu-bars">
          <FaBars onClick={toggleCollapsed} />
        </div>
      </div>
      <nav className={collapsed ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li key="1"> Surveys</li>
          <li key="2"> Rewards</li>
          <li key="3"> Account</li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
