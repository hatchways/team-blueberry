const express = require("express");
const router = express.Router();
const requestQueue = require("../queues/request");

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
      await requestQueue.add("firstRequest", {
        requestId,
        isDelayed: true,
      });
      res.status(201).send({ message: "Success" });
    });
  } catch {
    res.status(500).send({ message: "There was an internal server error." });
    console.log("There was an error in creating review.");
  }
});

router.post("/reviews", Auth, userController.getReviews);

module.exports = router;
