const express = require("express");
const router = express.Router();
const userManagementController = require("../controllers/userManagementController");

// const authenticateToken = require("../middleware/auth");
// const authorizeRoles = require("../middleware/authorizeRoles");

// router.post("/remove", authenticateToken, authorizeRoles(4), userManagementController.removeUser);

router.post("/remove", userManagementController.removeUser);
router.post("/changeRole", userManagementController.changeUserRole);
router.post("/updateCrewNo", userManagementController.updateCrewNo);

module.exports = router;
