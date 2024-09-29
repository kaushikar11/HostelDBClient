import React, { useState } from 'react';
import { signOut } from "firebase/auth";
import { Link, Navigate } from 'react-router-dom';
import { auth } from "./firebase";
import './Navbar.css'; // Import CSS for styling

const Navbar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false); // State for toggling menu

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                <Navigate to="/" />;
                console.log("Signed Out");
            })
            .catch((error) => console.log(error));
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle menu visibility
    };

    return (
        <nav className="navbar">
            <div className="logoContainer">
                <img src='/tce-logo.png' alt="Logo" className="logo" />
                <span className="logoText">Ladies Hostel Database</span>
            </div>

            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                {user && (
                    <>
                        <Link to="/home" className="nav-link">Home</Link>
                        <Link to="/add-student" className="nav-link">Add Student</Link>
                        <button className="logout-button" onClick={handleSignOut}>
                            Sign Out
                        </button>
                    </>
                )}
            </div>

            {/* Hamburger menu for mobile */}
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isOpen ? 'open' : ''}`}></div>
            </div>

            {/* Mobile Menu */}
            {isOpen && user && (
                <div className="mobile-nav-links">
                    <Link to="/home" className="nav-link" onClick={toggleMenu}>Home</Link>
                    <Link to="/add-student" className="nav-link" onClick={toggleMenu}>Add Student</Link>
                    <button className="logout-button" onClick={() => { toggleMenu(); handleSignOut(); }}>
                        Sign Out
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
