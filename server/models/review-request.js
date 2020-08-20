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
      // Editor returns an object that is converted to a JSON string and stored, needs to be parsed on frontend
      message: {
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
    min: 1,
    max: 5,
    default: 1,
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
  // References review owner
  embeddedReview: reviewSchema,
});

const Request = mongoose.model("Request", requestSchema, "requestCollection");

module.exports = { Review, Request };
