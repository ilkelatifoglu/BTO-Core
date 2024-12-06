require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");

const guideInfoRoutes = require("./src/routes/guideInfoRoutes");
const workRoutes = require("./src/routes/workRoutes");
const tourRoutes = require("./src/routes/tourRoutes");
const schoolRoutes = require("./src/routes/schoolRoutes");
const advisorRoutes = require("./src/routes/advisorRoutes");
const userManagementRoutes = require("./src/routes/userManagementRoutes");
const dataRoutes = require("./src/routes/dataRoutes");
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const fairRoutes = require("./src/routes/fairRoutes"); 

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

app.use('/uploads', express.static('uploads')); 
app.use('/profile', profileRoutes);
app.use("/auth", authRoutes);
app.use("/guide-info", guideInfoRoutes);
app.use("/work", workRoutes);
app.use("/tour", tourRoutes);
app.use("/school", schoolRoutes);
app.use("/advisors", advisorRoutes);
app.use("/user-management", userManagementRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/data', dataRoutes); 

app.use("/fairs", fairRoutes); // Matches /fairs/*

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
