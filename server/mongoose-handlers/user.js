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
};
