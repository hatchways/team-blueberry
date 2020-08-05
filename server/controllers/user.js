const User = require("../models/user");
const userModel = require("../mongoose-handlers/user");
const { Review, Request } = require("../models/review-request");
const findReviewerQueue = require("../queues/findReviewer");
const checkStatusQueue = require("../queues/checkStatus");
const requestHandler = require("../mongoose-handlers/request");
const updateAvatar = require("../helper/s3Handler");

module.exports = {
  // for logged in user
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.id)
        .exec()
        .then((user) => user.toObject());
      return res.status(200).send({ ...user });
    } catch (e) {
      // TODO maybe handle exception if user is logged in but db does not return
      // consider security implications
      console.log(e);
      return res.status(500).send("Error fetching user profile");
    }
  },
  // for other user
  async getUser(req, res, next) {
    try {
      const user = await User.getUser(req.params.userId);
      return res.status(200).send(user);
    } catch (e) {
      console.log(e);
      return res.status(500).send("Error fetching user profile");
    }
  },
  async updateUser(req, res, next) {
    try {
      const user = await User.update({
        id: req.user.id,
        update: { ...req.body },
        callback: updateAvatar,
      });
      return res.status(200).send(user);
    } catch (e) {
      console.log(e);
      return res.status(500).send("Error fetching user profile");
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

      const status = "pending",
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
      const userId = req.user;

      const reviews = await Review.find({ userId });

      res.status(201).json({ reviews });
    } catch {
      console.log("There was an error getting reviews.");
      return res
        .status(500)
        .send({ message: "There was an internal server error." });
    }
  },
  // accept or reject request
  async reviewRequest(req, res) {
    const userId = req.user;
    // accept or reject contains requestId
    const { isAccepted, requestId } = req.body;
    try {
      const job = await checkStatusQueue.getJob(requestId.toString());
      job.remove();
      if (isAccepted) {
        await Request.findByIdAndUpdate(requestId, {
          status: "accepted",
        });
        res.status(201).send("Reviewer Accepted");
      } else {
        await Request.findByIdAndUpdate(requestId, {
          $push: { reviewersDeclined: userId },
        });
        findReviewerQueue.add("findReviewer", {
          requestId,
          isDelayed: false,
        });
        res.status(201).send("Reviewer Rejected");
      }
    } catch {
      res.status(500).send("Internal Server Error");
    }
  },
};
