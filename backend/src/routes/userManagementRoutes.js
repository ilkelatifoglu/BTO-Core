const express = require("express");
const router = express.Router();
const userManagementController = require("../controllers/userManagementController");

const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

router.post("/remove", authenticateToken, authorizeRole(4), userManagementController.removeUser);
router.post("/changeRole", authenticateToken, authorizeRole(4), userManagementController.changeUserRole);
router.post("/updateCrewNo", authenticateToken, authorizeRole(4), userManagementController.updateCrewNo);
router.get("/advisors", authenticateToken, userManagementController.getAdvisors);

module.exports = router;
