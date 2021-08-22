var express = require("express");
var logRouter = express.Router();
const axios = require("axios");

logRouter.post("/log", (req, res) => {
  res.send(req.body);

  axios
    .post(
      "https://http-intake.logs.datadoghq.com/v1/input/" + req.body.api,
      req.body.logToSend,
      { headers: { "content-type": "application/json", ddsource: "teest" } }
    )
    .then((res) => {
      console.log("res:", res.status);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = logRouter;
