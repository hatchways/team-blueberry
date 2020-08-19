const Queue = require("bull");
const checkStatusQueue = require("./checkStatus");
const { enqueueTaskTime } = require("../constants");
const { Request } = require("../models/review-request");
const User = require("../models/user");
const { createNotification } = require("../controllers/notifications");

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
    console.log(author);
    await createNotification({
      recipient: foundReviewer.id,
      text: "You have new request",
      author: author.name,
      thread: result.embeddedReview._id,
    });

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
});

module.exports = findReviewerQueue;
