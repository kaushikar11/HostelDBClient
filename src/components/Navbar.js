import React, { useState } from 'react';
import { signOut } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "./firebase/firebase";
import './Navbar.css'; // Import CSS for styling

const Navbar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false); // State for toggling menu
    const navigate = useNavigate(); // For navigation after sign out

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/"); // Navigate to home after sign out
            console.log("Signed Out");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle menu visibility
    };

    return (
        <nav className="navbar">
            <div className="logoContainer">
                <img src='/tce-logo.png' alt="Logo" className="logo" />
                <span className="logoText">Hostel Database</span>
            </div>

            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                {user && (
                    <>
                        <Link to="/home" className="nav-link">Home</Link>
                        <Link to="/add-student" className="nav-link">Add Student</Link>
                        <Link to="/leaving-form" className="nav-link">Leaving Form</Link>
                        <Link to="/student-avail" className="nav-link">Student Avail</Link>
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
