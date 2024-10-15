import React, { Component } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './Login.css';
import { useNavigate } from 'react-router-dom';

class WelcomeMessage extends Component {
  componentDidMount() {
    console.log('component mounted');
  }

  componentWillUnmount() {
    console.log('component unmounted');
  }

  render() {
    const { email } = this.props;
    return <p className="welcome-message">Welcome, {email}!</p>;
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      isLoggedIn: false,
      showPassword: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.someProp !== prevState.someProp) {
      return { updatedProp: nextProps.someProp };
    }
    return null;
  }

  componentDidMount() {
    console.log('Login component mounted');
  }

  componentWillUnmount() {
    console.log('Login component will unmount');
  }

  handleLogin = async (e) => {
    e.preventDefault();
    this.setState({ error: '' });

    const { email, password } = this.state;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      this.setState({ isLoggedIn: true });
    } catch (err) {
      this.setState({ error: 'Invalid email or password' });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoggedIn && prevState.isLoggedIn !== this.state.isLoggedIn) {
      this.props.navigate('/home');
    }
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    const { email, password, error, isLoggedIn, showPassword } = this.state;

    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Warden Login</h1>

          <form onSubmit={this.handleLogin}>
            {error && <p className="error-message">{error}</p>}

            <div className="input-container">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
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
                  value={password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={this.togglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          {isLoggedIn && <WelcomeMessage email={email} />}
        </div>
      </div>
    );
  }
}

// Wrap with a functional component to use the `useNavigate` hook
export default function LoginWithNavigation(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}
