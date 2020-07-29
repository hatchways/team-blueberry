const mongoose = require("mongoose");

// import models
const { Review } = require("../models/review-request");
// import request handler
const requestHandler = require("./request");

module.exports = {
  createReview: async (userId, data, cb) => {
    // create const variables from data
    const language = data.language,
      title = data.title,
      codeSnippet = data.codeSnippet,
      messageText = data.messageText;
    const messagePostedBy = userId;
    const messagePostDate = new Date();

    const newReview = new Review({
      title,
      language,
      userId,
      messages: [
        { messageText, codeSnippet, messagePostedBy, messagePostDate },
      ],
    });

    newReview.save(function (err) {
      if (err) return console.log(err);

      const status = "pending",
        userLanguageLevel = data.languageLevel;

      requestHandler.createRequest(
        {
          userId,
          userLanguageLevel,
          status,
          embeddedReview: newReview,
        },
        cb
      );
    });
  },
};
