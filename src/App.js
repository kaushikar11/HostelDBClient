import React from 'react';
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Root from './Root';
import AddStudent from './AddStudent';
import StudentDetails from './StudentDetails';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }
      setUser(null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);


  const publicUrl = process.env.PUBLIC_URL || '';
  const backgroundImageStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${publicUrl}/ladies-hostel.jpeg)`
  };

  if (isFetching) {
    return (
      <>
        <div className="app-background" style={backgroundImageStyle}></div>
        <div className="app-content" style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div style={{ 
            padding: '40px', 
            backgroundColor: '#FEF5E7', 
            border: '2px solid #D4A574',
            color: '#8B0000',
            fontSize: '18px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Loading...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="app-background" style={backgroundImageStyle}></div>
      <div className="app-content">
        <Router>
          {user && <Navbar />}
          <Routes>
            <Route path="/" element={<Login user={user}/>} />
            <Route path="/home" element={<ProtectedRoute user={user}><Root/></ProtectedRoute>} />
            <Route path="/add-student" element={<ProtectedRoute user={user}><AddStudent/></ProtectedRoute>} />
            <Route path="/student/:id" element={<ProtectedRoute user={user}><StudentDetails/></ProtectedRoute>} />
          </Routes>
        </Router>
      </div>
    </>
  );
};

export default App;
