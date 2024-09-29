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

  if (isFetching) {
    return <h2>Loading...</h2>;
  }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login user={user}/>}></Route>
        <Route exact path="/home" element={<ProtectedRoute user={user}><Root/></ProtectedRoute>}></Route>
        <Route exact path="/add-student" element={<ProtectedRoute user={user}><AddStudent/></ProtectedRoute>}></Route>
        <Route exact path="/student/:id" element={<ProtectedRoute user={user}><StudentDetails/></ProtectedRoute>}></Route>
      </Routes>
    </Router>
        //   <Route path="/login" element={<Login />} />
        // <Route path="/root" element={<Root />} />
        // <Route path="/add-student" element={<AddStudent />} />
        // <Route path="/student/:id" element={<StudentDetails/>} />
  );
};

export default App;
