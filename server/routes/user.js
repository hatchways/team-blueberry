const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { showUser } = require("../controllers/user");

router.get("/me", showUser);

module.exports = router;
