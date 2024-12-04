const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/jwt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No authentication token provided" });
  }

  try {
    const decodedToken = verifyToken(token);
    if (!decodedToken.userId || typeof decodedToken.user_type !== "number") {
      return res.status(401).json({ error: "Malformed token" });
    }    
    req.user = {
      userId: decodedToken.userId,
      user_type: decodedToken.user_type,
      isTemp: decodedToken.isTemp, 
    };
    console.log('req.user in middleware:', req.user); 
    next(); 
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      console.error("Authentication error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = authenticateToken;