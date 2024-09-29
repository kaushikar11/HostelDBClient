import React from 'react';
import { signOut } from "firebase/auth";
import { Link, Navigate } from 'react-router-dom';

import { auth } from "./firebase";
import './Navbar.css'; // Assuming you have a separate CSS file for styling

const Navbar = () => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        <Navigate to="/"></Navigate>
        console.log("Sign Out")
      })
      .catch((error) => console.log(error));
  };
  return (
    <nav className="navbar">
      <div className="logoContainer">
        <img src='/tce-logo.png' alt="Logo" className="logo" />
        <span className="logoText">Ladies Hostel Database</span>
      </div>
      <div className="nav-buttons"> {/* Use a div instead of ul */}
        <button className="nav-button">
          <Link to="/home" className="nav-link">Home</Link> {/* Link styled as a button */}
        </button>
        <button className="nav-button">
          <Link to="/add-student" className="nav-link">Add Student</Link> {/* Link styled as a button */}
        </button>
        <button className="nav-button" onClick={handleSignOut}>Sign Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
