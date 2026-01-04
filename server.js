const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

//importing Routes
const SensorRoute = require("./routes/sensor.routes");
const DashboardRoute = require("./routes/dashboard.routes");

const mongoose = require("mongoose");

require("dotenv").config();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// http server
const server = http.createServer(app);

// socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

// this makes io available everywhere
app.set("io", io);

require("./sockets/socket")(io);

// routes
app.use("/api/sensor", SensorRoute);
app.use("/api/dashboard", DashboardRoute);

// test route
app.get("/", (req, res) => {
  res.send("Dashboard Backend Running 🚀");
});

// start server

// connecting db saperately without blocking
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log(`🚀 Successfully connected to Db`);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server Is Started`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });
