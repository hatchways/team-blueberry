const express = require("express");
const router = express.Router();
const findReviewerQueue = require("../queues/findReviewer");

const userController = require("../controllers/user");

// import Auth middleware
const Auth = require("../middleware/auth");

router.get("/me", Auth, userController.showUser);

router.put("/languages", Auth, userController.updateUserLanguages);

router.post("/review", Auth, async (req, res) => {
  try {
    const userId = req.user;
    const data = {
      language: req.body.language,
      languageLevel: req.body.languageLevel,
      title: req.body.title,
      codeSnippet: req.body.codeSnippet,
      messageText: req.body.messageText,
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

router.get("/request/:reviewId", Auth, userController.getRequest);

router.post("/request/message", Auth, userController.sendReviewMessage);

router.post("/request", Auth, userController.reviewRequest);

module.exports = router;
