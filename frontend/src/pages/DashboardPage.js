import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const DashboardPage = () => {
  const location = useLocation();
  const { user_type } = location.state || {};

  // If user_type is undefined or not ready, show a loading message
  if (user_type === undefined) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {user_type === 1 && <p>You are an candidate guide!</p>}
      {user_type === 2 && <p>You are a guide!</p>}
      {user_type === 3 && <p>You are an advisor!</p>}
      {user_type === 4 && <p>You are a coordinator!</p>}
    </div>
  );
};

export default DashboardPage;
