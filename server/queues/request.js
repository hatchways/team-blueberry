const Queue = require("bull");

// initiate request queue
// connect to redis default server for dev
const requestQueue = new Queue("requestReview");

// request model
const { Request } = require("../models/review-request");

// find reviewer logic
const { findReviewer } = require("../helper/helper");

// first request worker
requestQueue.process("firstRequest", async (job) => {
  // isDelayed is true or false
  // how do we implement a delayed first request? Does user need to specify delay time?
  const { requestId, isDelayed } = job.data;
  try {
    const requestData = await Request.findById(requestId);
    const foundReviewer = await findReviewer(requestData);
    // find new reviewer if reviewer is null
    if (!foundReviewer) {
      requestQueue.add(
        "firstRequest",
        {
          requestId,
        },
        {
          delay: 24 * 60 * 60 * 1000,
        }
      );
      return Promise.resolve();
    }
    await Request.findByIdAndUpdate(requestId, {
      selectedReviewer: foundReviewer._id,
    });
    requestQueue.add(
      "delayed",
      {
        requestId,
      },
      {
        delay: 24 * 60 * 60 * 1000,
        jobId: requestId.toString(),
      }
    );
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
});

// delayed worker
requestQueue.process("delayed", async (job) => {
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
        requestQueue.add("firstRequest", {
          requestId,
        });
        return Promise.resolve();
      }
      case "declined": {
        await Request.findByIdAndUpdate(requestId, {
          $push: { reviewersDeclined: selectedReviewer },
          status: "pending",
        });
        requestQueue.add("firstRequest", {
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

module.exports = requestQueue;
