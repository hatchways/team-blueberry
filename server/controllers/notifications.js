const User = require("../models/user");
const Notification = require("../models/notification");
const io = require("../sockets");

const createNotification = async (data) => {
  const { recipient, text, author, thread } = data;
  const newNotification = await new Notification({
    recipient,
    text,
    author,
    thread,
  });
  const notification = await newNotification.save();
  io.sendNotification(recipient, notification);
  return notification;
};

const updateNotifications = async (notifications) => {
  notifications.forEach(async (notification) => {
    const current = await Notification.findById(notification._id);
    current.seen = true;
    current.save();
  });
};

const getUsersNotifications = async (recipient) => {
  const notifications = await Notification.find({ recipient });
  return notifications;
};

module.exports = {
  createNotification,
  getUsersNotifications,
  updateNotifications,
};
