const Queue = require("bull");

// initiate request queue
// connect to redis default server for dev
const requestQueue = new Queue("requestReview");

// request model
const { Request } = require("../models/review-request");

requestQueue.process(async (job) => {
  const { languageLevel, status, requestId, reviewerId } = job.data;

  try {
    switch (status) {
      case "pending": {
        // foundReviewer = logic findReviewer() & send notifications
        if (job.opts.delay) {
          // update request
          await Request.findByIdAndUpdate(requestId, {
            $push: { reviewersDeclined: reviewerId },
          });
          // new task after 24 hours
          requestQueue.add(
            {
              languageLevel,
              status,
              requestId,
              reviewerId: foundReviewerId,
            },
            {
              // unique job id
              // able to access both requestId and reviewerId when reviewer accept to remove job
              jobId: (requestId + foundReviewerId).toString(),
              delay: 24 * 60 * 60 * 1000,
            }
          );
          return Promise.resolve();
        } else {
          requestQueue.add(
            {
              languageLevel,
              status,
              requestId,
              reviewerId: foundReviewerId,
            },
            {
              // unique job id
              // able to access both requestId and reviewerId when reviewer accept to remove job
              jobId: (requestId + foundReviewerId).toString(),
              delay: 24 * 60 * 60 * 1000,
            }
          );
          return Promise.resolve();
        }
      }
      case "declined": {
        await Request.findByIdAndUpdate(requestId, {
          $push: { reviewersDeclined: reviewerId },
          status: "pending",
        });
        requestQueue.add({
          languageLevel,
          status: "pending",
          requestId,
        });
        return Promise.resolve();
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
});

module.exports = requestQueue;
