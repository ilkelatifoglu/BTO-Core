const express = require("express");
const multer = require("multer");
const feedbackController = require("../controllers/feedbackController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/paginated", authenticateToken, feedbackController.getFeedbackWithPagination);
router.post("/upload", authenticateToken, upload.single("file"), feedbackController.uploadFeedback);
router.get("/:feedbackId/download", authenticateToken, feedbackController.getFeedbackDownloadLink);
router.delete("/:feedbackId", authenticateToken, feedbackController.deleteFeedback);
router.post("/createFeedback", authenticateToken, feedbackController.createFeedback);

module.exports = router;
