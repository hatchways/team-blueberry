const User = require("../models/user");
const userModel = require("../mongoose-handlers/user");
const { Review, Request } = require("../models/review-request");
const findReviewerQueue = require("../queues/findReviewer");
const checkStatusQueue = require("../queues/checkStatus");
const requestHandler = require("../mongoose-handlers/request");
const persistAvatar = require("../middleware/s3Handler");
const toDigit = require("../helper/digitalize");
const io = require("../sockets");
const { createNotification } = require("../controllers/notifications");

const handleError = (e, res) =>
  e.status && e.message
    ? res.status(e.status).send(e.message)
    : res.status(400).send(e);

const updateBalanceBe = async (userId, credits) => {
  const user = await User.findById(userId);
  const newUser = await User.findOneAndUpdate(
    { _id: userId },
    { balance: user.balance + credits },
    { new: true }
  );
  return newUser;
};

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

  // async updateBalanceBe(userId, credits) {
  //   const user = await User.findById(userId);
  //   const newUser = await User.findOneAndUpdate(
  //     { _id: userId },
  //     { balance: user.balance + credits },
  //     { new: true }
  //   );
  //   return newUser;
  // },

  async updateBalance(req, res) {
    try {
      const userId = req.body.userId,
        credits = req.body.credits;
      const user = await User.findById(userId);
      const newUser = await User.findOneAndUpdate(
        { _id: userId },
        { balance: user.balance + credits },
        { new: true }
      );
      return res.status(201).send(newUser.toObject());
    } catch (e) {
      return res.status(500).send("Error updating user balance");
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
        const requests = await Request.find({
          selectedReviewer: userId,
        });
        const embeddedReviewArray = [];

        for (let i = 0; i < requests.length; i++) {
          embeddedReviewArray.push(requests[i].embeddedReview);
        }

        return res.status(201).json({ reviews, embeddedReviewArray });
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
        const requestDoc = await Request.findByIdAndUpdate(requestId, {
          status: "accepted",
        });
        const reviewer = await User.findOne({
          _id: userId,
        }).select("_id name position avatar");

        await createNotification({
          recipient: requestDoc.userOwner,
          text: `${reviewer.name} accepted to review "${requestDoc.embeddedReview.title}"`,
          author: reviewer.name,
          thread: requestDoc.embeddedReview._id,
        });

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
      const reviewOwner = await User.findById(request.userOwner).select(
        "_id avatar name position"
      );
      const selectedReviewer = await User.findById(
        request.selectedReviewer
      ).select("_id avatar name position");
      const messageData = { newMessage, reviewOwner, selectedReviewer };

      const notificationRecipient =
        req.user.id === selectedReviewer.id
          ? request.userOwner
          : selectedReviewer.id;
      const author = await User.findById(req.user.id).select("name");
      await createNotification({
        recipient: notificationRecipient,
        text: `${author.name} left a message in "${request.embeddedReview.title}"`,
        author: author.name,
        thread: reviewId,
      });

      io.sendMessage(reviewId, messageData);
      return res.status(201).send(request);
    } catch {
      return res.status(500).send("Internal Server Error");
    }
  },

  async updateReviewAndUserRating(req, res) {
    const { reviewId, rating, comment } = req.body;

    // Updates Target Review Rating
    try {
      // need to extract status
      const request = await Request.findOne({ "embeddedReview._id": reviewId });

      if (rating >= 1 && rating <= 5) {
        request.embeddedReview.rating = rating;
      } else {
        throw new Error(
          "Rating provided is not either in an acceptable format or is not a value within 1 to 5."
        );
      }
      request.status = "closed";
      request.comment = comment;
      await request.save();

      // Updates User Rating - using selected reviewer
      const user = await User.findById(request.selectedReviewer);
      const author = await User.findById(request.userOwner);

      const reviews = await Request.find({
        selectedReviewer: request.selectedReviewer,
        status: "closed",
      }).select("embeddedReview");
      let averageRating = 0;

      if (rating >= 1 && rating <= 5) {
        reviews.forEach((item) => {
          averageRating += item.embeddedReview.rating;
        });

        averageRating = (averageRating + user.rating) / (reviews.length + 1);

        await User.findByIdAndUpdate(request.selectedReviewer, {
          rating: averageRating,
        });

        await updateBalanceBe(request.selectedReviewer, 1);

        await createNotification({
          recipient: request.selectedReviewer,
          text: `${author.name} rated your review "${request.embeddedReview.title}" (you get +1CR)`,
          author: author.name,
          thread: reviewId,
        });

        return res.status(201).send({ status: request.status });
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
      const foundUser = await User.findById(userId).select(
        "name position company avatar languages rating"
      );
      return res.status(200).send(foundUser);
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  },
  async fetchProfileReviews(req, res) {
    const { userId } = req.body;
    try {
      const foundReviews = await Request.find({ userOwner: userId });
      return res.status(200).send({ reviewsCount: foundReviews.length });
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  },
  async fetchProfileComments(req, res) {
    const { userId } = req.body;
    try {
      // extract only userOwner, comment and rating and convert to js object
      const foundComments = await Request.find(
        {
          selectedReviewer: userId,
          status: "closed",
        },
        { _id: 0, userOwner: 1, comment: 1, "embeddedReview.rating": 1 }
      ).lean();
      // extracting only user owner from foundComments
      const userOwnerArr = foundComments.map((comment) => comment.userOwner);
      // extract name, position, avatar of user owners
      const foundUsers = await User.find(
        { _id: { $in: userOwnerArr } },
        { name: 1, position: 1, avatar: 1 }
      );
      // creating user dictionary
      const foundUsersDict = Object.assign(
        {},
        ...foundUsers.map((user) => ({
          [user._id]: {
            name: user.name,
            position: user.position,
            avatar: user.avatar,
          },
        }))
      );
      // adding property to foundComments
      foundComments.map((comment) => {
        comment.name = foundUsersDict[comment.userOwner].name;
        comment.position = foundUsersDict[comment.userOwner].position;
        comment.avatar = foundUsersDict[comment.userOwner].avatar;
      });
      return res.status(200).send(foundComments);
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  },
};
