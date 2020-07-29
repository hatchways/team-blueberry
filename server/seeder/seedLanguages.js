const mongoose = require("mongoose");
const languagesModel = require("../models/languages");

const languages = [
  "Python",
  "JavaScript",
  "Java",
  "PHP",
  "GoLang",
  "C#",
  "C++",
  "Ruby",
];

const createLanguages = new languagesModel({ languages });

// db config
mongoose.set("useUnifiedTopology", true);
// DB_URl = online db url
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/blueberry";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`Connected to ${dbUrl}`);
  })
  .catch((err) => {
    console.log("ERROR", err.message);
  });

createLanguages.save(function (err) {
  if (err) return console.log(err);
  console.log("DONE!");
  mongoose.disconnect();
});
