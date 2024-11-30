require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const guideInfoRoutes = require("./src/routes/guideInfoRoutes");
const workRoutes = require("./src/routes/workRoutes");
const tourRoutes = require("./src/routes/tourRoutes");
const schoolRoutes = require("./src/routes/schoolRoutes");
const advisorRoutes = require("./src/routes/advisorRoutes");
const userManagementRoutes = require("./src/routes/userManagementRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/guideInfo", guideInfoRoutes);
app.use("/work", workRoutes);
app.use("/tour", tourRoutes);
app.use("/school", schoolRoutes);
app.use("/advisors", advisorRoutes);
app.use("/user-management", userManagementRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
