import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { setLoginSuccess, setLoginError, startGeneratingPDF } from './Thunk/actions'; // Import PDF action
import './Login.css';

// Simple Child Component to be Mounted
const WelcomeMessage = ({ email }) => {
  return <p className="welcome-message">Welcome, {email}!</p>;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const passwordRef = useRef(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch hook
  
  // Access loginError from the Redux store (Make sure the state is correct)
  const loginError = useSelector((state) => state.app.loginError); // Fixed: 'app' instead of 'pdf'

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const password = passwordRef.current.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(setLoginSuccess(email)); // Dispatch action on successful login
      // Dispatch PDF generation after successful login
      dispatch(startGeneratingPDF({ title: 'Login PDF', content: `User logged in: ${email}` }));
      navigate('/home'); // Navigate on successful login
    } catch (err) {
      setError('Invalid email or password');
      dispatch(setLoginError('Invalid email or password')); // Dispatch error action
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Warden Login</h1>

        {loginError && <p className="error-message">{loginError}</p>} {/* Display Redux error message */}

        <form onSubmit={handleLogin}>
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

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Conditional Rendering of WelcomeMessage */}
        {email && <WelcomeMessage email={email} />}
      </div>
    </div>
  );
};

export default Login;
