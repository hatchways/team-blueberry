const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Auth = require("../middleware/auth");
const User = require("../models/user");
const { genToken } = require("../helper/helper");
const { cookieName } = require("../constants");

const languages = require("../mongoose-handlers/languages");

router.post("/register", async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;
  try {
    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).send("All fields need to be filled!");
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).send("Email already exist!");
    }
    if (password.length < 6) {
      return res
        .status(401)
        .send("Password needs to be at least 6 characters long");
    }
    if (password !== confirmPassword) {
      return res.status(401).send("Password and confirm Password do not match");
    }
    const newUser = new User({
      email,
      password,
      name,
    });
    await newUser.save();
    // send token
    const token = genToken(req, res, newUser);
    return res.status(201).send({
      message: "User created!",
      user: newUser.toObject(),
    });
  } catch {
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).send("Incorrect email and password");
    }
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      return res.status(401).send("Incorrect email and password");
    }
    // send token
    const token = genToken(req, res, foundUser);
    return res.status(200).send({
      message: "User logged in!",
      user: foundUser.toObject(),
    });
  } catch {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/languages", Auth, async (req, res) => {
  const languageList = await languages.getLanguages();
  res.status(200).send(languageList);
});

router.post("/logout", (req, res) => {
  res.clearCookie(cookieName);
  res.status(200).send("Cleared Cookie");
});

module.exports = router;
