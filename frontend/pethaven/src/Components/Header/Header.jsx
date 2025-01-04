import React, { useState, useEffect, useRef } from "react";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sideMenuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="logo">PetHaven</div>
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="#featured">Featured Pets</a>
        <a href="#testimonials">Testimonials</a>
      </nav>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <div
        className={`side-menu ${menuOpen ? "show" : ""}`}
        ref={sideMenuRef}
      >
        <a href="#featured">Featured Pets</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#search">Search</a>
        <a href="/login">Login</a>
      </div>
    </header>
  );
};

export default Header;

