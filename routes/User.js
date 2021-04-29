const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const salt = 10;

userRouter.get("/getUser", (req, res) => {
  res.json(req.session.currentUser);
});

userRouter.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  User.findOne({
    username,
  }).then((userDocument) => {
    if (!userDocument) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const isValidPassword = bcrypt.compareSync(password, userDocument.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const userObj = userDocument.toObject();
    delete userObj.password;
    req.session.currentUser = userObj;

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

module.exports = userRouter;
