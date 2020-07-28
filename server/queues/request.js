const Queue = require("bull");

// initiate request queue
// connect to redis default server for dev
const requestQueue = new Queue("requestReview");

// search reviewer, wait for 24 hours for response
// rejected => search for another reviewer

requestQueue.process(async (job) => {
  const { languageLevel, status } = job.data;

  // check status
  try {
    switch (status) {
      case "pending": {
        // find reviewer logic findReviewer() - send notification to reviewer
      }
      case "declined": {
        // find a new reviewer
        // push declined reviewer into request review data
        // change status in request status data
      }
    }
  } catch {
    throw new Error("Internal Server Error");
  }
});

module.exports = requestQueue;
