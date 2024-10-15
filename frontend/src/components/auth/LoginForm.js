//Handles the login form which includes inputs for the email and password and submit button. 
import React, { useState } from 'react'; //allows to store state variables for form fields(email, password) and errors
import './LoginForm.css'; 

const LoginForm = ({ onSubmit }) => { //will be triggered when the user submits the form
  // Local state to handle form fields and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => { //triggered when the user clicks the "Login" button.
    e.preventDefault(); // Prevent page refresh

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(''); // Clear error message
    onSubmit(email, password); // Call the onSubmit function passed as a prop from the parent
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
          required
        />
      </div>

      {error && <p className="error-message">{error}</p>} {/* Display error message if validation fails */}

      <button type="submit" className="btn">Login</button>
    </form>
  );
};

export default LoginForm;
