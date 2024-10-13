import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const passwordRef = useRef(null);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const password = passwordRef.current.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Warden Login</h1>
        <form onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                ref={passwordRef}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
