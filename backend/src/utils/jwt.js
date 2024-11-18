const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = (userId, isTemp) => {
  const token = jwt.sign({ userId, isTemp }, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
