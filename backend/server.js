require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const guideInfoRoutes = require('./src/routes/guideInfoRoutes'); // Import the new route


const app = express();

// Configure CORS with allowed headers
app.use(cors({
  origin: 'http://localhost:3000', // Replace this with your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use('/guideInfo', guideInfoRoutes); // Register the new route


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});