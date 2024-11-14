import { useState } from 'react';
import PropTypes from 'prop-types';  // For prop type validation (optional)
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

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
        <Button type="submit" label="Login" icon="pi pi-sign-in" className="w-full" />

        {/* Forgot Password Button */}
        <Button
          label="Forgot Password?"
          className="p-button-link w-full"
          onClick={onForgotPassword}
          style={{marginTop: '0.5rem'}}
        />
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
