module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Frontend connected");

    socket.on("disconnect", () => {
      console.log("Frontend disconnected");
    });
  });
};
