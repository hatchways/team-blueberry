const mongoose = require("mongoose");

// import models
const { Request } = require("../models/review-request");

module.exports = {
  createRequest: (data, cb) => {
    const newRequest = new Request({
      userOwner: data.userId,
      requsetCreateDate: data.requestCreateDate,
      status: data.status,
    });

    newRequest.save(function (err, user) {
      if (err) return console.log(err);

      const requestId = newRequest._id;
      cb();
    });
  },
};
