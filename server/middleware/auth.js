const jwt = require("jsonwebtoken");
const { cookieName } = require("../constants.js");

const auth = (req, res, next) => {
  // get token from cookie
  const token = req.cookies[cookieName];
  if (!token) return res.status(401).send("Not Authorized");
  const secret = process.env.JWT_KEY || "secret";
  try {
    // verify token - user
    const user = jwt.verify(token, secret);
    req.user = user;
    next();
  } catch {
    return res.status(403).send("You do not have access");
  }
};

module.exports = auth;
