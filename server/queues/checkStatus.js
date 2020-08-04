const Queue = require("bull");
const findReviewerQueue = require("./findReviewer");
const { Request } = require("../models/review-request");

// initiate checkStatus queue
// connect to redis default server for dev
const checkStatusQueue = new Queue("checkStatus");

checkStatusQueue.process("checkStatus", async (job) => {
  const { requestId } = job.data;
  const { status, selectedReviewer } = await Request.findById(requestId).select(
    "status selectedReviewer"
  );
  try {
    switch (status) {
      case "pending": {
        await Request.findByIdAndUpdate(requestId, {
          $push: { reviewersDeclined: selectedReviewer },
        });
        findReviewerQueue.add("firstRequest", {
          requestId,
        });
        return Promise.resolve();
      }
      case "declined": {
        await Request.findByIdAndUpdate(requestId, {
          $push: { reviewersDeclined: selectedReviewer },
          status: "pending",
        });
        findReviewerQueue.add("findReviewer", {
          requestId,
        });
        return Promise.resolve();
      }
      case "accepted": {
        return Promise.resolve();
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
});

module.exports = checkStatusQueue;
