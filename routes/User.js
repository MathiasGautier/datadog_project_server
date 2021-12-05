const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const axios = require("axios");
const logger = require("../config/logger");

const salt = 10;

userRouter.get("/getUser", (req, res) => {
  res.json(req.session.currentUser);
});

userRouter.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({
    username,
  }).then((userDocument) => {
    if (!userDocument) {
      logger.log("info", "invalid credentials", {username:req.body.username});
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const isValidPassword = bcrypt.compareSync(password, userDocument.password);
    if (!isValidPassword) {
      logger.log("info", "invalid password", {username:req.body.username});
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const userObj = userDocument.toObject();
    delete userObj.password;
    req.session.currentUser = userObj;
    logger.log("info", "Sucessfully logged in", {username:req.body.username});
    res.status(200).json(userObj);
  });
});

userRouter.post("/register", (req, res, next) => {
  const { username, password, apiKey } = req.body;

  if (username === "" || password === "" || apiKey === "") {
    res.send("Empty fields");
  }

  User.findOne({
    username,
  }).then((userDocument) => {
    if (userDocument) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      username,
      apiKey,
      password: hashedPassword,
    };

    User.create(newUser).then((newUserDocument) => {
      const userObj = newUserDocument.toObject();
      delete userObj.password;
      req.session.currentUser = userObj;
      logger.log("info", "New account created", {username:req.body.username});
      res.status(201).json(userObj);
    });
  });
});

userRouter.get("/isLoggedIn", (req, res, next) => {
  if (req.session.currentUser) {
    const id = req.session.currentUser._id;
    User.findById(id)
      .then((userDocument) => {
        const userObj = userDocument.toObject();
        delete userObj.password;
        res.status(200).json(userObj);
      })
      .catch((error) => {
        res.status(401).json(error);
      });
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
});

userRouter.get("/logout", (req, res, next) => {
  req.session.destroy(function (error) {
    if (error) res.status(500).json(error);
    else
      res.status(200).json({
        message: "Succesfully disconnected.",
      });
  });
});

userRouter.get("/users", (req, res) => {
  User.find()
    .then((userDocument) => {
      res.status(200).json(userDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

userRouter.post("/api", (req, res) => {
  axios
    .get("https://api.datadoghq.com/api/v1/validate", {
      headers: {
        "content-type": "application/json",
        "DD-API-KEY": req.body.apiKey,
      },
    })
    .then((success) => {
      logger.log("info", "API key validated");
      console.log("res", success.statusText);
      res.send(success.statusText);
    })
    .catch((error) => {
      console.log("error", error.response.data.status);
      logger.log("info", "API key not valid");
      res.send(error.response.data.status);
    });
});

userRouter.put("/apiKey/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .then((document) => {
      res.status(200).json(document);
      logger.log("info", "API key updated");
    })
    .catch((error) => {
      res.status(500).json(error);
      logger.log("info", "couldn't update API key");
    });
});

module.exports = userRouter;
