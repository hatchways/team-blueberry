const mongoose = require("mongoose");

// review model
const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  language: {
    type: String,
  },

  // References user that created the initial review request
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  messages: [
    {
      messageText: {
        type: String,
      },

      codeSnippet: {
        type: String,
      },

      // References message user owner
      messagePostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      messagePostDate: {
        type: Date,
      },
    },
  ],
  reviewCreatedDate: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
});

const Review = mongoose.model("Review", reviewSchema, "reviewCollection");

// request model
const requestSchema = new mongoose.Schema({
  // References user owner
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  userLanguageLevel: {
    type: Number,
  },

  selectedReviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // Needed for timeout eventually
  requestCreateDate: {
    type: Date,
    default: Date.now,
  },
  reviewersDeclined: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "declined", "accepted", "closed"],
    default: "pending",
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  // References review owner
  embeddedReview: reviewSchema,
});

const Request = mongoose.model("Request", requestSchema, "requestCollection");

module.exports = { Review, Request };
