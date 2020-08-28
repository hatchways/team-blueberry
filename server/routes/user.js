const express = require("express");
const router = express.Router();
const findReviewerQueue = require("../queues/findReviewer");
const userController = require("../controllers/user");

// import Auth middleware
const Auth = require("../middleware/auth");

router.get("/me", Auth, userController.getMe);
router.post("/me/avatar", Auth, userController.createUserAvatar);
router.put("/me", Auth, userController.updateUser);

router.post("/profile", Auth, userController.fetchProfile);
router.post("/profile/reviews", Auth, userController.fetchProfileReviews);

router.put("/languages", Auth, userController.updateUserLanguages);

router.put("/balance", Auth, userController.updateBalance);

router.post("/review", Auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = {
      language: req.body.language,
      title: req.body.title,
      message: JSON.stringify(req.body.content.text),
    };
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

router.post("/reviews", Auth, userController.getReviews);

router.post(
  "/reviews/rate-review",
  Auth,
  userController.updateReviewAndUserRating
);

router.post("/request/message", Auth, userController.sendReviewMessage);

router.post("/request", Auth, userController.reviewRequest);

module.exports = router;
