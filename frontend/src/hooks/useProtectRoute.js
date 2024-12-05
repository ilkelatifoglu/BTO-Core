import { useContext } from "react";
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

const useProtectRoute = (requiredRoles = null) => {
  const { user } = useContext(AuthContext);

  const isAuthorized = checkAuthorization(user?.user_type, requiredRoles);

  return isAuthorized;
};

export default useProtectRoute;
