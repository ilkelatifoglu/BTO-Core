import './LoginForm.css';
import { useState } from 'react';

const LoginForm = ({ onSubmit }) => {
  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password); // Invoke the onSubmit prop with email and password
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <button type="submit" className="btn">Login</button>
    </form>
  );
};

export default LoginForm;
