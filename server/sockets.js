const socketIo = require("socket.io");
const options = {
  pingInterval: 10000,
  pingTimeout: 50000,
  cookie: false,
};

class SocketConfig {
  constructor() {
    this.io;
  }

  bindServer(server) {
    this.io = new socketIo(server, options);
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

  sendMessage(room, data) {
    this.io.to(room).emit("message", data);
  }
}

const socketListeners = (socket) => {
  console.log("Waiting for socket connections from client ...");
  socket.on("login", (userId) => {
    console.log("User subscribed to notifications " + userId);
    socket.join(userId);
  });
  socket.on("thread", (reviewId) => {
    console.log("User subscribed to thread " + reviewId);
    socket.join(reviewId);
  });
};

const sockets = new SocketConfig();

module.exports = sockets;
