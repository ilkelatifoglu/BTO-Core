const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = (userId, user_type, isTemp) => {
  const token = jwt.sign({ userId, user_type, isTemp }, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Generate a unique cancellation token for tours or events
 * @param {string} tourId - The tour ID
 * @param {string} tourDate - The date of the tour
 * @param {string} type - The type of entity (e.g., "tour", "individual_tour", "fair")
 * @returns {string} - The cancellation JWT token
 */
exports.generateCancellationToken = (tourId, tourDate, type) => {
  // Convert the tour date to Unix timestamp (seconds since epoch)
  const expirationTime = Math.floor(new Date(tourDate).getTime() / 1000);

  return jwt.sign({ tourId, type }, JWT_SECRET, { expiresIn: expirationTime });
};

exports.generateFeedbackToken = (tourId, type) => {
  return jwt.sign({ tourId, type }, JWT_SECRET, { expiresIn: "7d"});
};