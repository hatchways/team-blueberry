const mongoose = require("mongoose");

// import models
const Request = require("../../models/request");

module.exports = {
  createRequest: (data, cb) => {
    const newRequest = new Request({
      reviewOwner: data.reviewId,
      userOwner: data.userId,
      requsetCreateDate: data.requestCreateDate,
      reviewersDeclined: [],
      statuses: [
        {
          statusDate: new Date(),
          status: data.status,
        },
      ],
    });

    newRequest.save(function (err, user) {
      if (err) return console.log(err);

      const requestId = newRequest._id;
      cb();
    });
  },
};
