const { Request } = require("../models/review-request");

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
};
