import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/firebase'; // Import Firebase auth instance
import './Login.css'; // Import CSS for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [showPassword]= useState(false); // State to toggle password visibility
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset any previous error
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in');
      setIsLoggedIn(true); // Set login state to true
    } catch (err) {
      setError('Invalid email or password');
      console.log(err);
    }
  };

  // Effect to redirect user if logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home'); // Redirect to /home on successful login
    }
  }, [isLoggedIn, navigate]); // Dependency array includes isLoggedIn

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Warden Login</h1>
        <form onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              id="email" // Added id to link with the label
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email" // Improve usability
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                id="password" // Added id to link with the label
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password" // Improve usability
              />
            </div>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
