import { useState } from 'react';
import PropTypes from 'prop-types';  // For prop type validation (optional)
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import '../../pages/LoginPage.css'

// Import CSS
import './LoginForm.css';
import 'primereact/resources/themes/saga-blue/theme.css';  // Or any other theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const LoginForm = ({ onSubmit, onForgotPassword }) => {
  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password); // Invoke the onSubmit prop with email and password
  };

  return (
    <Card className="login-card">
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="field">
          <label htmlFor="email" className="block">Email</label>
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full"
          />
        </div>

        {/* Password Field */}
        <div className="field">
          <label htmlFor="password" className="block">Password</label>
          <InputText
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="login-button">
          <i className="pi pi-sign-in" style={{ marginRight: '8px' }}></i>Login
        </button>

        {/* Forgot Password Button */}
        <button
          type="button"
          className="forgot-button"
          onClick={onForgotPassword}
          style={{marginTop: '0.5rem'}}
        >
          Forgot Password?
        </button>
      </form>
    </Card>
  );
};

// Optional: Define prop types for better maintainability
LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onForgotPassword: PropTypes.func.isRequired,
};

export default LoginForm;
