const Queue = require("bull");
const checkStatusQueue = require("./checkStatus");
const { enqueueTaskTime } = require("../constants");
const { Request } = require("../models/review-request");
const User = require("../models/user");
const { createNotification } = require("../controllers/notifications");
const { findReviewer } = require("../helper/helper");

// initiate findReviewer queue
// connect to redis default server for dev
const findReviewerQueue = new Queue("findReviewer", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
});

findReviewerQueue.process("findReviewer", async (job) => {
  const { requestId, isDelayed } = job.data;
  try {
    const requestData = await Request.findById(requestId);
    const foundReviewer = await findReviewer(requestData);
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
    const result = await Request.findByIdAndUpdate(
      requestId,
      {
        selectedReviewer: foundReviewer.id,
      },
      { new: true }
    );
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
    const author = await User.findById(result.userOwner);
    await createNotification({
      recipient: foundReviewer.id,
      text: `${author.name} asks you to review "${result.embeddedReview.title}"`,
      author: author.name,
      thread: result.embeddedReview._id,
    });

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
});

module.exports = findReviewerQueue;
