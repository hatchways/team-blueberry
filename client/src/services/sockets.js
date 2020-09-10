import io from "socket.io-client";

class SocketManager {
  constructor() {
    // this needs to be fixed, possible wrong port or ip and port
    this.socket = io("/"); //constantly getting proxy error
    this.subscribers = [];
  }
  //subscribe to notifications
  login(userId) {
    this.socket.emit("login", userId);
  }
  //subscribe to messages in a thread
  messages(reviewId) {
    this.socket.emit("thread", reviewId);
  }

  subscribe(component, func) {
    this.subscribers.push({ name: component, function: func });
  }

  unsubscribe(component) {
    this.subscribers.splice(
      this.subscribers.findIndex((item, index) => {
        if (item.name === component) {
          return index;
        }
        return null;
      }),
      1
    );
  }

  initializeEvents() {
    this.socket.on("notification", (data) => {
      this.subscribers.forEach((subscriber) => {
        if (subscriber.name === "notifications") {
          try {
            subscriber.function(data);
          } catch (err) {
            console.log(err);
          }
        }
      });
    });
    this.socket.on("message", (data) => {
      this.subscribers.forEach((subscriber) => {
        if (subscriber.name === "messages") {
          try {
            subscriber.function(data);
          } catch (err) {
            console.log(err);
          }
        }
      });
    });
  }
}

const socket = new SocketManager();
socket.initializeEvents();

export default socket;
