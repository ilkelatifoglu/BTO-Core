const express = require("express");
const { register, login, deleteUserByEmail, updatePassword, getUser } = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete-user", deleteUserByEmail);
router.put("/update-password", updatePassword);
router.get("/user", authenticateToken, getUser);

module.exports = router;
