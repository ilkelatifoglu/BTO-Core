const express = require("express");
const {
  register,
  login,
  deleteUserByEmail,
  updatePassword,
  getUser,
  getAllUsers,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authenticateToken, authorizeRole(4), authController.register);
router.post("/login", login);
router.delete("/delete-user", authenticateToken, authorizeRole(4), deleteUserByEmail);
router.put("/update-password", authenticateToken, updatePassword);
router.get("/user", authenticateToken, getUser);
router.get("/users", authenticateToken, getAllUsers);

router.post("/verify-otp", authController.verifyOtp);

router.post("/password/reset-request", authController.requestPasswordReset);
router.post("/password/reset", authController.resetPassword);

module.exports = router;
