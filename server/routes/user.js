const express = require("express");
const router = express.Router();
const findReviewerQueue = require("../queues/findReviewer");

const userController = require("../controllers/user");

// import Auth middleware
const Auth = require("../middleware/auth");

router.get("/me", Auth, userController.getMe);
router.post("/me/avatar", Auth, userController.createUserAvatar);
router.put("/me", Auth, userController.updateUser);

router.put("/languages", Auth, userController.updateUserLanguages);

router.post("/review", Auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = {
      language: req.body.language,
      title: req.body.title,
      content: req.body.content,
    };
    console.log(data);
    await userController.createReview(userId, data, async (requestId) => {
      await findReviewerQueue.add("findReviewer", {
        requestId,
        isDelayed: false,
      });
      res.status(201).send({ message: "Success" });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "There was an internal server error." });
  }
});

router.get("/reviews", Auth, userController.getReviews);

router.get("/request/:reviewId", Auth, userController.getRequest);
router.get("/:userId", userController.getUser);

router.post("/request/message", Auth, userController.sendReviewMessage);

router.post("/request", Auth, userController.reviewRequest);

module.exports = router;
