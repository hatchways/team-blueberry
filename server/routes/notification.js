const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notification = require("../models/notification");
const {
  createNotification,
  getUsersNotifications,
  updateNotifications,
  deleteNotification,
} = require("../controllers/notifications");

router.get("/:id", async (req, res) => {
  try {
    const notificationData = await getUsersNotifications(req.params.id);
    res.status(200).send(notificationData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteNotification(req.params.id);
    res.status(200).send("Deleted notification");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
});

router.put("/update-read", async (req, res) => {
  try {
    await updateNotifications(req.body.notifications);
    res.status(200).send({ message: "Successfully updated notifications" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const notification = await createNotification(req.body);
    console.log(notification);
    res.status(200).send(notification);
  } catch (error) {
    res.status(500).send({ error: err });
  }
});

module.exports = router;
