const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

//importing Routes
const SensorRoute = require("./routes/sensor.routes");
const DashboardRoute = require("./routes/dashboard.routes");

const connectDB = require("./utils/dbutils");

const app = express();

const PORT = process.env.PORT || 3020;

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
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// connecting db saperately without blocking
connectDB()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });
