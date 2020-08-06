const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = {
  updateLanguages: async (userId, skillList, cb) => {
    User.findById(userId, function (error, doc) {
      if (error) {
        cb(true, error);
      }

      const formattedSkillList = Object.values(skillList);
      try {
        doc.languages = [...formattedSkillList];
        doc.save(cb);
      } catch (error) {
        cb(true, error);
        console.error(error);
      }
    });
  },
  updateUserRating: async (userId, rating, cb) => {
    User.findById(userId, function (error, doc) {
      if (error) {
        cb(true, error);
      }
      try {
        const rating = (doc.rating + rating) / 2;

        doc.rating = rating;
        doc.save(cb);
      } catch (error) {
        cb(true, error);
        console.error(error);
      }
    });
  },
};
