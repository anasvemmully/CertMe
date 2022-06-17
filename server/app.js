var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");

// const fs = require("fs/promises");

const fileupload = require("express-fileupload");

const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});
mongoose.connection.on("error", () => {
  console.log("failed to connect database");
});

var apiRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: process.env.NODE_ENV === "production",
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// passport initialisation
app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);

// const p = path.join(__dirname, "uploads");
// console.log("path : " + p);

// fs.readdir(p).then((files) => {
//   console.log(files);
// });

app.use("/api", apiRouter);
app.use("/*", usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
