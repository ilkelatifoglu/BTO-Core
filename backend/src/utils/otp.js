// src/utils/otp.js

/**
 * Generates a 6-digit one-time password (OTP)
 * @returns {string} A random 6-digit number as a string
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Validates OTP format
 * @param {string} otp - The OTP to validate
 * @returns {boolean} True if OTP is valid, false otherwise
 */
const validateOtp = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Checks if OTP is expired
 * @param {Date} expiryTime - The expiry timestamp
 * @returns {boolean} True if OTP is expired, false otherwise
 */
const isOtpExpired = (expiryTime) => {
  return new Date() > new Date(expiryTime);
};

module.exports = {
  generateOtp,
  validateOtp,
  isOtpExpired,
};
