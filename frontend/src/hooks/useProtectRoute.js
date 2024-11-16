import { useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Helper function to check if user_type matches any of the required roles
const checkAuthorization = (userType, requiredRoles) => {
  if (!userType) return false;

  if (!requiredRoles) return true; // If no roles are required, authorize by default

  // If requiredRoles is an array, check if the user type is in the array
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userType);
  }

  // If requiredRoles is a single role, check if it matches
  return userType === requiredRoles;
};

const useProtectRoute = (redirectPath = "/login", requiredRoles = null) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isAuthorized = checkAuthorization(user?.user_type, requiredRoles);

  useEffect(() => {
    if (!isAuthorized) {
      navigate(redirectPath);
    }
  }, [isAuthorized, navigate, redirectPath]);

  return isAuthorized;
};

export default useProtectRoute;
