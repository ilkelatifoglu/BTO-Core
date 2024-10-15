import React from 'react';
import LoginForm from '../components/auth/LoginForm';  // Ensure LoginForm is correctly imported
import { useAuth } from '../hooks/useAuth';  // Ensure named import
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login, error, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    await login(email, password);
    if (user) {
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onSubmit={handleLogin} />
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;  // Ensure correct default export
