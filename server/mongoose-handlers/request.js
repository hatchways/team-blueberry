const mongoose = require("mongoose");

// import models
const { Request } = require("../models/review-request");

module.exports = {
  createRequest: (data, cb) => {
    const newRequest = new Request({
      userOwner: data.userId,
      // Added userLanguageLevel to assist with matching to reviewers
      userLanguageLevel: data.userLanguageLevel,
      // Removed date value due to mongoose timestamps schema type
      status: data.status,
    });

    newRequest.save(function (err, user) {
      if (err) return console.log(err);

      const requestId = newRequest._id;
      cb(requestId);
    });
  },
};
