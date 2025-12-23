const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./utils/dbutils");

const app = express();
const PORT = 3020;

// middleware
app.use(express.json());
app.use(cors());

// http server
const server = http.createServer(app);

// socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

// make io available everywhere
app.set("io", io);

// socket logic
require("./sockets/socket")(io);

// routes
app.use("/api/sensor", require("./routes/sensor.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

// test route
app.get("/", (req, res) => {
  res.send("Dashboard Backend Running 🚀");
});

// start only after DB connects
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
