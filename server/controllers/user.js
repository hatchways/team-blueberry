const User = require("../models/user");
const userModel = require("../mongoose-handlers/user");
const { Review, Request } = require("../models/review-request");
const findReviewerQueue = require("../queues/findReviewer");
const checkStatusQueue = require("../queues/checkStatus");
const requestHandler = require("../mongoose-handlers/request");
const persistAvatar = require("../middleware/s3Handler");
const mongoose = require("mongoose");

const handleError = (e, res) =>
  e.status && e.message
    ? res.status(e.status).send(e.message)
    : res.status(400).send(e);


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
      });
      return res.status(200).send(user);
    } catch (e) {
      console.log(e);
      return res.status(500).send("Error updating user profile");
    }
  },
  async createUserAvatar(req, res) {
    try {
      // TODO add additional middleware to enforce proper image type
      const signedURL = await persistAvatar(req);
      const user = await User.update({
        id: req.user.id,
        update: { avatar: signedURL },
      });
      return res.status(201).json({ ...user });
    } catch (e) {
      console.log(e);
      return handleError(e, res);
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
      if (req.body.singleTarget) {
        const reviewId = req.body.reviewId;
        const request = await Request.findOne({
          "embeddedReview._id": reviewId,
        });
        res.status(201).json({ request });
      } else {
        const userId = req.user.id;
        const reviews = await Review.find({ userId: userId });
        return res.status(201).json({ reviews });
      }
    } catch (error) {
      console.error(error.message);
      console.log("There was an error getting reviews.");
      return res
        .status(500)
        .send({ message: "There was an internal server error." });
    }
  },
  async getRequest(req, res) {
    const { reviewId } = req.params;
    try {
      const request = await Request.findOne({
        "embeddedReview._id": reviewId,
      });
      res.status(201).send(request.toObject());
    } catch (err) {
      return res.status(500).send("Internal Server Error");
    }
  },
  // accept or reject request
  async reviewRequest(req, res) {
    console.log("In here");
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
  async sendReviewMessage(req, res) {
    const { userId } = req.user;
    const { reviewId, message, codeSnippet } = req.body;
    try {
      const request = await Request.findOne({
        "embeddedReview._id": reviewId,
      });
      request.embeddedReview.messages.push({
        messageText: message,
        codeSnippet: codeSnippet,
        messagePostedBy: userId,
        messagePostDate: new Date(),
      });
      await request.save();
      return res.status(201).send(request.toObject());
    } catch {
      return res.status(500).send("Internal Server Error");
    }
  },
};
