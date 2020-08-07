const mongoose = require("mongoose");

// import models
const { Request } = require("../models/review-request");
const requestHandler = require("./request");

module.exports = {
  createRequest: (data, cb) => {
    const newRequest = new Request({
      userOwner: data.userId,
      userLanguageLevel: data.userLanguageLevel,
      status: data.status,
      embeddedReview: data.embeddedReview,
    });
    newRequest.save(function (err, user) {
      if (err) return console.log(err);

      const requestId = newRequest._id;
      cb(requestId);
    });
  },
  // gets all relevant requests
  getRequests: async (req, res) => {
    try {
      if (req.body.singleTarget) {
        const _id = req.body.requestId;

        const request = await Request.findOne({ _id });
        res.status(201).json({ request });
      } else {
        const userOwner = req.user;

        const requests = await Request.find({ userOwner });

        res.status(201).json({ requests });
      }
    } catch {
      console.log("There was an error getting requests.");
      return res
        .status(500)
        .send({ message: "There was an internal server error." });
    }
  },
};
