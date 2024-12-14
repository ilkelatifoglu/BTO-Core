// feedbackRoutes.js
const express = require("express");
const feedbackController = require("../controllers/feedbackController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/getFeedbackByRole", feedbackController.getFeedbackByRole);
router.post("/createFeedback", feedbackController.createFeedback);
router.put("/updateFeedback", feedbackController.updateFeedback);
router.delete("/:feedbackId", feedbackController.deleteFeedback);  
router.post("/submitFeedback", feedbackController.submitFeedback); 
router.get("/validateToken", feedbackController.validateToken);

module.exports = router;

// const express = require("express");
// // const multer = require("multer");
// const feedbackController = require("../controllers/feedbackController");

// const router = express.Router();
// // const upload = multer({ storage: multer.memoryStorage() });

// // router.get("/paginated", feedbackController.getFeedbackWithPagination);
// // router.post("/upload", upload.single("file"), feedbackController.uploadFeedback);
// // router.get("/:feedbackId/download", feedbackController.getFeedbackDownloadLink);
// // router.delete("/:feedbackId", feedbackController.deleteFeedback);

// router.post("/createFeedback", feedbackController.createFeedback);

// module.exports = router;
