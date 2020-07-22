const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// testing root route
router.get("/", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

// register route
router.post("/register", async (req, res) => {
  const { email, confirmEmail, password, confirmPassword } = req.body;

  try {
    // validate if all fields are filled
    if (!email || !confirmEmail || !password || !confirmPassword) {
      return res.status(400).send("All fields need to be filled!");
    }
    // validate if email aleady exist
    const userExist = await User.findOne({ email }).exec();
    if (userExist) {
      return res.status(409).send("Email already exist!");
    }
    // validate if password length is lesser than 6
    if (password.length < 6) {
      return res
        .status(401)
        .send("Password needs to be at least 6 characters long");
    }
    // validate confirm email and confirm password
    if (email !== confirmEmail || password !== confirmPassword) {
      return res
        .status(401)
        .send(
          "Email and confirm Email or Password and confirm Password do not match"
        );
    }
    // hash password - bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // create new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    // send token
    // proess.env.JWT_KEY to store secret key
    const token = await jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      "secret",
      {
        expiresIn: "1hr",
      }
    );
    // save token in cookie
    return res.cookie("token", token, { httpOnly: true }).status(201).send({
      message: "User created",
      token,
    });
  } catch {
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // find user using email
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(401).send("Email not found");
    }
    // compare inputted password with user's password
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      return res.status(401).send("Incorrect Password");
    }
    // send token
    // // proess.env.JWT_KEY to store secret key
    const token = await jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
      },
      "secret",
      {
        expiresIn: "1hr",
      }
    );
    // save token in cookie
    return res.cookie("token", token, { httpOnly: true }).status(200).send({
      message: "User logged in",
      token,
    });
  } catch {
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
