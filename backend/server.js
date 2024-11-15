require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const workRoutes = require("./src/routes/workRoutes"); // Import work routes

const app = express();

// Configure CORS with allowed headers
app.use(cors({
  origin: 'http://localhost:3000', // Replace this with your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/work", workRoutes);

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
