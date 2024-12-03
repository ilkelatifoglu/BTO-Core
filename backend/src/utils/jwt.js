const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


exports.generateToken = (userId, user_type, isTemp) => {
  const token = jwt.sign({ userId, user_type, isTemp }, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
exports.generateCancellationToken = (tourId, tourDate) => {
  // Convert the tour date to Unix timestamp (seconds since epoch)
  const expirationTime = Math.floor(new Date(tourDate).getTime() / 1000);

  // Generate the token with the tour ID and expiration
  return jwt.sign({ tourId }, JWT_SECRET, { expiresIn: expirationTime });
};