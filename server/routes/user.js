const express = require("express");
const router = express.Router();

// Does importing here work for userController imports? It looks like it does, which is interesting.
const User = require("../models/user");

const userController = require("../controllers/user");

// import Auth middleware
const Auth = require("../middleware/auth");

router.get("/me", /* Auth,*/ userController.showUser);

// TestRoute
router.put("/languages", /* Auth,*/ userController.updateUserLanguages);

router.post("/review", Auth, userController.createReview);

router.post("/reviews", Auth, userController.getReviews);

module.exports = router;
