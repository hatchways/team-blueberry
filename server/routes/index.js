const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user");
const { cookieName, cookieExpiry } = require("../constants.js");

// register route
router.post("/register", async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;

  try {
    // validate if all fields are filled
    if (!email || !name || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      return res.status(401).send("Password and confirm Password do not match");
    }
    // create new user
    const newUser = new User({
      email,
      password,
      name,
    });
    await newUser.save();
    // send token
    // proess.env.JWT_KEY to store secret key
    const secretKey = process.env.JWT_KEY || "secret";
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      secretKey,
      {
        expiresIn: "24hr",
      }
    );
    // save token in cookie
    return res
      .cookie(cookieName, token, {
        httpOnly: true,
        // check env if production
        secure: req.app.get("env") === "development" ? false : true,
        maxAge: cookieExpiry,
      })
      .status(201)
      .send({
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
    // compare inputted password with user's password
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!foundUser || !isValidPassword) {
      return res.status(401).send("Incorrect email and password");
    }
    // send token
    // // proess.env.JWT_KEY to store secret key
    const secretKey = process.env.JWT_KEY || "secret";
    const token = jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
      },
      secretKey,
      {
        expiresIn: "1hr",
      }
    );
    // save token in cookie
    return res
      .cookie(cookieName, token, {
        httpOnly: true,
        // check env if production
        secure: req.app.get("env") === "development" ? false : true,
        maxAge: cookieExpiry,
      })
      .status(200)
      .send({
        message: "User logged in",
        token,
      });
  } catch {
    return res.status(500).send("Internal Server Error");
  }
});

// test for middleware
router.get("/profile", auth, (req, res) => {
  res.send(req.user);
});

module.exports = router;
