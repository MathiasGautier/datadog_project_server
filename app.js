var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true
  };

var app = express();





app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var indexRouter = require("./routes/index");
var logRouter = require("./routes/logs");

app.use("/", indexRouter);
app.use("/logs", logRouter);

// Error handler middleware
// If you pass an argument to your next function in any of your routes or middlewares
// You will end up in this middleware
app.use((err, req, res, next) => {
  console.log("An error occured");
  res.status(err.status || 500);
  if (!res.headersSent) {
    res.json(err);
  }
});



module.exports = app;