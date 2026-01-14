import React from 'react';
import { signOut } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "./firebase";
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
        console.log("Sign Out");
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="navbar-title-corner">
        <span className="navbar-title">Hostel Database</span>
      </div>
      <div className="tce-logo-center">
        <img src="/tce-logo.png" alt="TCE Logo" className="tce-logo" />
      </div>
      <div className="navbar-menu-corner">
        <Link to="/home" className="navbar-link">Home</Link>
        <Link to="/add-student" className="navbar-link">Add Student</Link>
        <button className="navbar-button" onClick={handleSignOut}>Sign Out</button>
      </div>
    </>
  );
};

export default Navbar;
