module.exports = function authorizeRoles(...allowedUserTypes) {
    return (req, res, next) => {
      if (!req.user || typeof req.user.user_type !== "number") {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      const { user_type } = req.user;
  
      if (!allowedUserTypes.includes(user_type)) {
        return res.status(403).json({ error: "Access denied. Insufficient permissions." });
      }
  
      next();
    };
  };