const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
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
  })
  .then(() => {
    console.log(`Connected to ${dbUrl}`);
  })
  .catch((err) => {
    console.log("ERROR", err.message);
  });

const { json, urlencoded } = express;

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);
app.use("/ping", pingRouter);

app.use("/api/user", auth, userRouter);

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

module.exports = app;
