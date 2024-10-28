import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const useProtectRoute = (redirectPath = "/login", requiredRoles = null) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const isAuthorized = checkAuthorization(user?.user_type, requiredRoles);

    // If not authorized, redirect to the specified path
    if (!isAuthorized) {
      navigate(redirectPath);
    }
  }, [user, navigate, requiredRoles, redirectPath]);

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
  const isAuthorized = checkAuthorization(user?.user_type, requiredRoles);

  return isAuthorized;
};

export default useProtectRoute;
