const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const SensorRoute = require("./routes/sensor.routes");
const DashboardRoute = require("./routes/dashboard.routes");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/sensor", SensorRoute);
app.use("/api/dashboard", DashboardRoute);

app.get("/", (req, res) => {
  res.send("Backend running");
});

// create server
const server = http.createServer(app);

// socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});
app.set("io", io);
require("./sockets/socket")(io);

// ✅ START SERVER FIRST (CRITICAL)
server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server listening on port", PORT);
});

// ✅ CONNECT DB SEPARATELY
mongoose
  .connect(DB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err.message));
