import io from "socket.io-client";

class SocketManager {
  constructor() {
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
    const findSubscriber = () => {
      this.subscribers.forEach((subscriber, index) => {
        if (subscriber.name === component) {
          return index;
        }
      });
    };
    this.subscribers.splice(findSubscriber(), 1);
  }

  initializeEvents() {
    this.socket.on("notification", (data) => {
      console.log("notification received");
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
      console.log("message received");
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
