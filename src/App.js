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

const App = () => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      <Navbar user={user} /> {/* Pass user prop to Navbar */}
      <Routes>
        <Route path="/" element={<Login user={user}/>}></Route>
        <Route exact path="/home" element={<ProtectedRoute user={user}><Root/></ProtectedRoute>}></Route>
        <Route exact path="/add-student" element={<ProtectedRoute user={user}><AddStudent/></ProtectedRoute>}></Route>
        <Route exact path="/student/:id" element={<ProtectedRoute user={user}><StudentDetails/></ProtectedRoute>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
