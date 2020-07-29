const Queue = require("bull");
const mongoose = require("mongoose");

// initiate request queue
// connect to redis default server for dev
const requestQueue = new Queue("requestReview");

// request model
const { Request } = require("../models/review-request");

requestQueue.process(async (job) => {
  const { languageLevel, status, requestId } = job.data;

  try {
    switch (status) {
      case "pending": {
        // foundReviewer = logic findReviewer() & send notification
        // after 24 hours with no response
        if (job.opts.delay) {
          const currentRequest = await Request.findById(requestId);
          await Request.findByIdAndUpdate(requestId, {
            // push selected reviewer into reviewers declined
            // update selected reviewer into foundReviewer
          });
          requestQueue.add({
            languageLevel,
            status: currentRequest.status,
            requestId,
          });
          return Promise.resolve();
        } else {
          // on first 24 hours after creating review
          await Request.findByIdAndUpdate(requestId, {
            // update selected reviewer with foundreviewer
          });
          requestQueue.add(
            {
              languageLevel,
              status,
              requestId,
            },
            {
              delay: 24 * 60 * 60 * 1000,
            }
          );
          return Promise.resolve();
        }
      }
      case "declined": {
        // foundReviewer = logic findReviewer() & send notification
        const currentRequest = await Request.findById(requestId);
        await Request.findByIdAndUpdate(requestId, {
          // push selected reviewer into reviewers declined
          // update selected reviewer into foundReviewer
          status: "pending",
        });
        return Promise.resolve();
      }
    }
  } catch {
    return Promise.reject(err);
  }
});

module.exports = requestQueue;
