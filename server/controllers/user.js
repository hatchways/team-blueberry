// Imports for models for searching
const reviewModel = require("../mongoose-handlers/review");
const userModel = require("../mongoose-handlers/user");
// import model User for searching
const Review = require("../models/review-request");

// const showUser = async (req, res, next) => {
//   //We may not need the check for logged in user any longer due to Auth middleware, as Auth is checked prior to each API call
//   // check for logged in user
//   const userId = req.user ? req.user.id : null;
//   if (!userId)
//     return res
//       .status(401)
//       .send("You are not authorized to access this resource");
//   try {
//     const user = await User.findById(userId)
//       .exec()
//       .then((user) => user.toObject());
//     return res.status(200).send({ ...user });
//   } catch (e) {
//     // TODO maybe handle exception if user is logged in but db does not return
//     // consider security implications
//     console.log(e);
//     return res
//       .status(401)
//       .send("You are not authorized to access this resource");
//   }
// };

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

  // Need to clean up error catching
  async updateUserLanguages(req, res) {
    try {
      // Make calls to to update user languages on user model
      const userId = req.user,
        skillList = { ...req.body.languages };

      await userModel.updateLanguages(userId, skillList, (boolError, error) => {
        if (boolError) {
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

    // console.log(req.body.languages);
    //return res.status(201).send(skillList);
  },

  // Creates review based of data provided
  async createReview(req, res) {
    try {
      const userId = req.user;

      const data = {
        language: req.body.language,
        languageLevel: req.body.languageLevel,
        title: req.body.title,
        codeSnippet: req.body.codeSnippet,
        messageText: req.body.messageText,
      };

      await reviewModel.createReview(userId, data, () => {
        res.status(201).send({ message: "Success" });
      });
    } catch {
      console.log("There was an error in creating review.");
      return res
        .status(500)
        .send({ message: "There was an internal server error." });
    }
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
};
