require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const guideInfoRoutes = require('./src/routes/guideInfoRoutes'); // Import the new route
const workRoutes = require("./src/routes/workRoutes"); // Import work routes
const tourRoutes = require("./src/routes/tourRoutes"); 
const schoolRoutes = require("./src/routes/schoolRoutes"); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.use(cors());
app.use(express.json());
app.set("io", io);

app.use("/auth", authRoutes);
app.use("/guideInfo", guideInfoRoutes);

app.use("/work", workRoutes);
app.use("/tour", tourRoutes);
app.use("/school", schoolRoutes);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
