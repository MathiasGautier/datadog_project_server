var express = require("express");
var logRouter = express.Router();
const axios = require("axios");
// require("dotenv").config();

// logRouter.post('/log',
// (req,res)=>{
// res.send(req.body)
// })
// console.log("yooo", process.env.API_KEY)

logRouter.post("/log", (req, res) => {
  res.send(req.body);

  let logToSend = JSON.parse(req.body.text);
  logToSend.ddsource = "test_your_stuff";

  axios
    .post(
      "https://http-intake.logs.datadoghq.com/v1/input/" + req.body.api,
      logToSend,
      { headers: { "content-type": "application/json" } }
    )
    .then((res) => {
      // console.log(req.body.text)
      console.log("res:", res.status);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = logRouter;
