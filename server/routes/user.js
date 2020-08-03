const express = require("express");
const router = express.Router();

const User = require("../models/user");
const userController = require("../controllers/user");

// import Auth middleware
const Auth = require("../middleware/auth");

router.get("/me", Auth, userController.getMe);
router.put("/me", Auth, userController.updateUser);

router.get("/:userId", userController.getUser);

router.put("/languages", Auth, userController.updateUserLanguages);

router.post("/review", Auth, userController.createReview);

router.post("/reviews", Auth, userController.getReviews);

module.exports = router;
