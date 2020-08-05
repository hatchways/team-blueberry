const User = require("../models/user");
const reviewModel = require("../mongoose-handlers/review");
const userModel = require("../mongoose-handlers/user");
const Review = require("../models/review-request");
const requestHandler = require("../mongoose-handlers/request");

module.exports = {
  async showUser(req, res, next) {
    //We may not need the check for logged in user any longer due to Auth middleware, as Auth is checked prior to each API call
    // check for logged in user
    const userId = req.user ? req.user.id : null;
    if (!userId)
      return res
        .status(401)
        .send("You are not authorized to access this resource");
    try {
      const user = await User.findById(userId)
        .exec()
        .then((user) => user.toObject());
      return res.status(200).send({ ...user });
    } catch (e) {
      // TODO maybe handle exception if user is logged in but db does not return
      // consider security implications
      console.log(e);
      return res
        .status(401)
        .send("You are not authorized to access this resource");
    }
  },

  async updateUserLanguages(req, res) {
    try {
      // Make calls to to update user languages on user model
      const userId = req.user,
        skillList = { ...req.body.languages };

      await userModel.updateLanguages(userId, skillList, (error) => {
        if (error) {
          console.error(error.message);
          return res.status(500).send({
            message: "There was an internal server error.",
          });
        } else {
          res.status(201).send({ message: "Success" });
        }
      });
    } catch (error) {
      console.log("There was an error in updating user languages.");
      console.error(error);
      return res.status(500).send({
        message: "There was an internal server error.",
      });
    }
  },
  createReview: async (userId, data, cb) => {
    // create const variables from data
    const language = data.language,
      title = data.title,
      codeSnippet = data.codeSnippet,
      messageText = data.messageText;
    const messagePostedBy = userId;
    const messagePostDate = new Date();

    const newReview = new Review({
      title,
      language,
      userId,
      messages: [
        { messageText, codeSnippet, messagePostedBy, messagePostDate },
      ],
    });

    newReview.save(function (err) {
      if (err) return console.log(err);

      const status = "Pending",
        userLanguageLevel = data.languageLevel;

      requestHandler.createRequest(
        {
          userId,
          userLanguageLevel,
          status,
          embeddedReview: newReview,
        },
        cb
      );
    });
  },
  // gets all relevant reviews
  async getReviews(req, res) {
    try {
      if (req.body.singleTarget) {
        const _id = req.body.reviewId;

        const review = await Review.findOne({ _id });

        res.status(201).json({ review });
      } else {
        const userId = req.body.user;

        const reviews = await Review.find({ userId: userId });

        res.status(201).json({ reviews });
      }
    } catch (error) {
      console.error(error.message);
      console.log("There was an error getting reviews.");
      return res
        .status(500)
        .send({ message: "There was an internal server error." });
    }
  },
};
