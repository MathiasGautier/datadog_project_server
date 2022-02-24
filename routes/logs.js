var express = require("express");
var logRouter = express.Router();
const axios = require("axios");
const logger = require("../config/logger");

logRouter.post("/log", (req, res) => {
  axios
    .post(
      "https://http-intake.logs.datadoghq.com/v1/input/",
      req.body.logToSend,
      {
        headers: {
          "content-type": "application/json",
          "DD-API-KEY": req.body.api,
        },
      }
    )
    .then((success) => {
      logger.log("info", "Log sent", { username: req.body.username });
      console.log(success);
      res.send(success.response);
    })
    .catch((error) => {
      logger.log("info", "Fail to send log", { username: req.body.username });
      console.log(error.response.status);
      res.send(error.response.status);
    });
});

logRouter.post("/post_event", (req, res) => {
  console.log(req.body.eventObject)
  axios
    .post(
      "https://api.datadoghq.com/api/v1/events",
      {
        title: req.body.eventObject.eventTitle,
        text: req.body.eventObject.eventText,
        tags: req.body.eventObject.tagList
      },
      {
        headers: {
          "content-type": "text/json",
          "DD-API-KEY": req.body.eventObject.apiKey,
        },
      }
    )
    .then((document) => {
      console.log(document.config);
      logger.log("info", "Sent event", { username: req.body.eventObject.username });
      res.send(
        JSON.stringify(document.config.data, null, "\t")
      )

      res.status(200);
    })
    .catch((error) => {
      logger.log("info", "Failed to send event", error);
      console.log(error);
      res.status(500).json(error);
    });
})

logRouter.post("/post_simple_log", (req, res) => {
  axios
    .post(
      "https://http-intake.logs.datadoghq.com/v1/input?ddsource=test-your-stuff",
      req.body.logObject.text,
      { headers: { "content-type": "text/plain", "DD-API-KEY": req.body.logObject.api } }
    )
    .then((document) => {
      console.log(document);
      logger.log("info", "Sent simple text log", { username: req.body.logObject.username });
      res.send(
        ("hello", document.status)
      )

      res.status(200);
    })
    .catch((error) => {
      logger.log("info", "Failed to send simple text log", error);
      console.log(error);
      res.status(500).json(error);
    });
})





module.exports = logRouter;
