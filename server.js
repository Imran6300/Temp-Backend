const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const SensorRoute = require("./routes/sensor.routes");
const DashboardRoute = require("./routes/dashboard.routes");
const initMQTT = require("./mqtt/mqttClient");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/sensor", SensorRoute);
app.use("/api/dashboard", DashboardRoute);

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// server
const server = http.createServer(app);

// socket
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// 🔥 CORRECT ORDER
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // start server
    server.listen(PORT, "0.0.0.0", () => {
      console.log("🚀 Server listening on port", PORT);
    });

    // start MQTT AFTER DB
    initMQTT(io);
  })
  .catch((err) => {
    console.error("❌ Mongo error:", err.message);
  });
