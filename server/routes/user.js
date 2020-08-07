const express = require("express");
const router = express.Router();
const findReviewerQueue = require("../queues/findReviewer");

const userController = require("../controllers/user");
const mongoose = require("mongoose");
// import Auth middleware
const Auth = require("../middleware/auth");

router.get("/me", Auth, userController.showUser);

router.put("/languages", Auth, userController.updateUserLanguages);
// Auth,
router.post("/review", async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.body.user);
    const data = {
      language: req.body.language,
      languageLevel: req.body.languageLevel,
      title: req.body.title,
      message: { content: "TEST" },
    };

    await userController.createReview(userId, data, async (requestId) => {
      await findReviewerQueue.add("findReviewer", {
        requestId,
        isDelayed: false,
      });
      res.status(201).send({ message: "Success" });
    });
  } catch {
    res.status(500).send({ message: "There was an internal server error." });
    console.log("There was an error in creating review.");
  }
});

router.post("/reviews", Auth, userController.getReviews);

// router.get("/request/:reviewId", Auth, userController.getRequest);

router.post("/request/message", Auth, userController.sendReviewMessage);

router.post("/request", Auth, userController.reviewRequest);

module.exports = router;
