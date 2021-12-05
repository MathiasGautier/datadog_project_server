const tracer = require("dd-trace").init({
  logInjection : true,
  //debug:true,
  env: "local_macbook_test",
  service:"test_your_stuff"
})


tracer.use('http',{
    service:"test_your_stuff-http"
  })




var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
const session = require("express-session");
const axios = require("axios");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("./config/dbConnection");
const app = express();
const logger=require("./config/logger")


const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }), // Persist session in database.
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
};
app.use(session(sessionConfig));

const indexRouter = require("./routes/index");
const logRouter = require("./routes/logs");
const userRouter = require("./routes/User");
const metricRouter= require ("./routes/metrics");
const { isModuleNamespaceObject } = require("util/types");

app.use("/", indexRouter);
app.use("/logs", logRouter);
app.use("/user", userRouter);
app.use("/metrics", metricRouter);

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

console.log(process.env)

module.exports = app;