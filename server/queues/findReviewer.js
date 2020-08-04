const Queue = require("bull");
const checkStatusQueue = require("./checkStatus");
const { enqueueTaskTime } = require("../constants");
const { Request } = require("../models/review-request");

// find reviewer logic
const { findReviewer } = require("../helper/helper");

// initiate findReviewer queue
// connect to redis default server for dev
const findReviewerQueue = new Queue("findReviewer");

// tasks
findReviewerQueue.process("findReviewer", async (job) => {
  // isDelayed is true or false
  const { requestId, isDelayed } = job.data;
  try {
    const requestData = await Request.findById(requestId);
    const foundReviewer = await findReviewer(requestData);
    // find new reviewer if reviewer is null
    if (!foundReviewer) {
      findReviewerQueue.add(
        "findReviewer",
        {
          requestId,
        },
        {
          delay: enqueueTaskTime,
        }
      );
      return Promise.resolve();
    }
    await Request.findByIdAndUpdate(requestId, {
      selectedReviewer: foundReviewer._id,
    });
    checkStatusQueue.add(
      "checkStatus",
      {
        requestId,
      },
      {
        delay: enqueueTaskTime,
        jobId: requestId.toString(),
      }
    );
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
});

module.exports = findReviewerQueue;
