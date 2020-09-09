const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const redis = require("redis");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const notificationsRouter = require("./routes/notification");
const paymentRouter = require("./routes/payment");

// imports for mongoose models could go here
const auth = require("./middleware/auth");

// db config
mongoose.set("useUnifiedTopology", true);
// DB_URl = online db url
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/blueberry";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Connected to ${dbUrl}`);
  })
  .catch((err) => {
    console.log("ERROR", err.message);
  });
// take out deprecation warning when updating
mongoose.set("useFindAndModify", false);

// redis config
// production will be put in env file
const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

client.on("connect", function () {
  console.log("Redis client connected");
});

client.on("error", function (err) {
  console.log("Something went wrong " + err);
});

const { json, urlencoded } = express;

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.raw({ type: "image/jpg", limit: "1mb" }));
// app.use(express.static(join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/payment", auth, paymentRouter);

app.use("/api/user", auth, userRouter);
app.use("/api/notifications", notificationsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

// if (process.env.NODE_ENV == "production") {
// app.use(express.static("client/build/"));
// `${__dirname}/client/build`
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
// }

module.exports = app;
