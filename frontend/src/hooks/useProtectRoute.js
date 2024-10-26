import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useProtectRoute = (redirectPath = "/login", requiredRoles = null) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { user_type } = location.state || {};

    const isAuthorized = checkAuthorization(user_type, requiredRoles);

    // If not authorized, redirect to the specified path
    if (!isAuthorized) {
      navigate(redirectPath);
    }
  }, [location, navigate, requiredRoles, redirectPath]);

  // Helper function to check if user_type matches any of the required roles
  const checkAuthorization = (userType, requiredRoles) => {
    if (!userType) return false;

    // If requiredRoles is an array, check if the user type is in the array
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userType);
    }

    // If requiredRoles is a single role, check if it matches
    return userType === requiredRoles;
  };

  // Return whether the user is allowed based on the role
  const isAuthorized = checkAuthorization(location.state?.user_type, requiredRoles);

  return isAuthorized;
};

export default useProtectRoute;
