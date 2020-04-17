
const onSocket = (io,data,eventOn,eventEmit) => {
  io.on("connection", (socket) => {
    socket.on(eventOn, () => {
      io.emit(eventEmit, data);
    });
  });
};

module.exports = {
  onSocket,
};
