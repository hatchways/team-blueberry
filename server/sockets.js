const socketIo = require("socket.io");

class SocketConfig {
  constructor() {
    this.io;
  }

  bindServer(server) {
    this.io = new socketIo(server);
  }

  start() {
    this.io.on("connection", (socket) => {
      socketListeners(socket);
    });
  }

  emit(event, data) {
    this.io.emit(event, data);
  }

  sendNotification(room, data) {
    this.io.to(room).emit("notification", data);
  }
}

const socketListeners = (socket) => {
  console.log("User connected via sockets");
};

const sockets = new SocketConfig();

module.exports = sockets;
