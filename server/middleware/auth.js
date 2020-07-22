const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // validate if token is present & get token
  const cookieName = process.env.COOKIE_NAME || "token";
  const token =
    req.headers.cookie && req.headers.cookie.split(`${cookieName}=`)[1];
  console.log(token);
  if (!token) return res.status(401).send("Not Authorized");
  const secret = process.env.JWT_KEY || "secret";
  try {
    // verify token - user id and email
    const { id, email } = jwt.verify(token, secret);
    req.user = {
      id,
      email,
    };
    next();
  } catch {
    return res.status(403).send("You do not have access");
  }
};

module.exports = auth;
