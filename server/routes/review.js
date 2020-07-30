const express = require("express");
const router = express.Router();

const reviewModel = require("../mongoose-handlers/review");

const requestQueue = require("../queues/request");

// import model User for searching
const Review = require("../models/review-request");

// import Auth middleware
const Auth = require("../middleware/auth");

// Creates review based of data provided
router.post("/review", Auth, async (req, res) => {
  try {
    const userId = req.user;
    const data = {
      language: req.body.language,
      languageLevel: req.body.languageLevel,
      title: req.body.title,
      codeSnippet: req.body.codeSnippet,
      messageText: req.body.messageText,
    };

    await reviewModel.createReview(userId, data, async (requestId) => {
      // since this is a brand new request, we know status is pending
      await requestQueue.add({
        languageLevel: data.languageLevel,
        status: "pending",
        requestId,
      });
      res.status(201).send({ message: "Success" });
    });
  } catch {
    res.status(500).send({ message: "There was an internal server error." });
    console.log("There was an error in creating review.");
  }
});

// gets all relevant reviews
router.post("/reviews", Auth, async (req, res) => {
  try {
    const userId = req.user;

    const reviews = await Review.find({ userId });

    res.status(201).json({ reviews });
  } catch {
    res.status(500).send({ message: "There was an internal server error." });
    console.log("There was an error getting reviews.");
  }
});

module.exports = router;
