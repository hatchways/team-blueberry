const User = require("../models/user");
const userModel = require("../mongoose-handlers/user");
const { Review, Request } = require("../models/review-request");
const findReviewerQueue = require("../queues/findReviewer");
const checkStatusQueue = require("../queues/checkStatus");
const requestHandler = require("../mongoose-handlers/request");
const persistAvatar = require("../middleware/s3Handler");
const toDigit = require("../helper/digitalize");
const io = require("../sockets");

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
  async updateUser(req, res) {
    const { name, company, position } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          name: name,
          position: position,
          company: company,
        },
        { new: true }
      );
      return res.status(200).send(user.toObject());
    } catch (e) {
      console.log(e);
      return res.status(500).send("Error updating user profile");
    }
  },
  // TODO need to recheck once set up s3
  async createUserAvatar(req, res) {
    try {
      // TODO add loading state to let image upload
      const signedURL = await persistAvatar(req);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          avatar: signedURL,
        },
        { new: true }
      );
      return res.status(201).json(user.toObject());
    } catch (e) {
      console.log(e);
      return handleError(e, res);
    }
  },
  async updateUserLanguages(req, res) {
    try {
      const userId = req.user.id,
        skillList = req.body.languages.map((item) => {
          return { language: item.language, level: toDigit(item.level) };
        });
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { languages: [...skillList] },
        { new: true }
      );
      return res.status(201).send(user.toObject());
    } catch (e) {
      return res.status(500).send("Error updating user profile");
    }
  },

  async createReview(userId, data, cb) {
    // create const variables from data
    const language = data.language,
      title = data.title,
      message = data.message;
    const messagePostedBy = userId;
    const messagePostDate = new Date();
    const user = await User.findById(userId);
    const languageIndex = user.languages.findIndex(
      (item) => item.language === language
    );
    const userLanguageLevel =
      languageIndex >= 0 ? user.languages[languageIndex].level : 0;
    const newReview = new Review({
      title,
      language,
      userId,
      messages: [{ message, messagePostedBy, messagePostDate }],
    });

    newReview.save(function (err) {
      if (err) return console.log(err);

      const status = "pending";

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
        // get userOwner and extract data
        const reviewOwner = await User.findById(request.userOwner).select(
          "_id name position avatar"
        );
        const foundReviewer = request.embeddedReview.messages.find(
          (message) =>
            JSON.stringify(message.messagePostedBy) ===
            JSON.stringify(request.selectedReviewer)
        );
        if (foundReviewer) {
          const reviewer = await User.findOne({
            _id: foundReviewer.messagePostedBy,
          }).select("_id name position avatar");
          res.status(201).json({ request, reviewer, reviewOwner });
        } else res.status(201).json({ request, reviewOwner, reviewer: {} });
      } else {
        const userId = req.user.id;
        const reviews = await Review.find({ userId: userId });
        return res.status(201).json({ reviews });
      }
    } catch (error) {
      console.error(error.message);
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
    const userId = req.user.id;
    // accept or reject contains requestId
    const { isAccepted, requestId } = req.body;
    try {
      const job = await checkStatusQueue.getJob(requestId.toString());
      job.remove();
      if (isAccepted) {
        await Request.findByIdAndUpdate(requestId, {
          status: "accepted",
        });
        const reviewer = await User.findOne({
          _id: userId,
        }).select("_id name position avatar");
        return res.status(201).send(reviewer);
      } else {
        await Request.findByIdAndUpdate(requestId, {
          $push: { reviewersDeclined: userId },
          status: "pending",
        });
        findReviewerQueue.add("findReviewer", {
          requestId,
          isDelayed: false,
        });
        return res.status(201).send("Reviewer Rejected");
      }
    } catch {
      return res.status(500).send("Internal Server Error");
    }
  },

  async sendReviewMessage(req, res) {
    const { reviewId, message } = req.body;
    try {
      const request = await Request.findOne({
        "embeddedReview._id": reviewId,
      });

      request.embeddedReview.messages.push({
        message: message,
        messagePostedBy: req.user.id,
        messagePostDate: new Date(),
      });
      const newMessage = await request.save();
      io.sendMessage(reviewId, newMessage);
      return res.status(201).send(request);
    } catch {
      return res.status(500).send("Internal Server Error");
    }
  },

  async updateReviewAndUserRating(req, res) {
    const { userId } = req.user;
    const { reviewId, rating } = req.body;

    // Updates Target Review Rating
    try {
      const request = await Request.findOne({ "embeddedReview._id": reviewId });

      if (rating >= 1 && rating <= 5) {
        request.embeddedReview.rating = rating;
      } else {
        throw new Error(
          "Rating provided is not either in an acceptable format or is not a value within 1 to 5."
        );
      }

      await request.save();

      // Updates User Rating
      const user = await User.findOne({ userId });

      const reviews = await Review.find({ userId: userId });
      let averageRating = 0;

      if (rating >= 1 && rating <= 5) {
        averageRating = 0;

        reviews.forEach((item) => {
          averageRating += item.rating;
        });

        averageRating = (averageRating + user.rating) / (reviews.length + 1);

        await User.findByIdAndUpdate({ userId }, { rating: averageRating });
        return res.status(201).send("Message: Success");
      } else {
        throw new Error(
          "Rating provided is not either in an acceptable format or is not a value within 1 to 5."
        );
      }
    } catch (e) {
      res.status(406).send(e.message);
    }
  },
  async fetchProfile(req, res) {
    const { userId } = req.body;
    try {
      const foundUser = await User.findById(userId);
      // simplify foundUser object to only fetch necessary data
      return res.status(200).send(foundUser.toObject());
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  },
};
