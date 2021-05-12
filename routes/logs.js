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
  console.log("text:", req.body.text);
  console.log("api:", req.body.api)
  res.send(req.body);


  axios
    .post(
      "https://http-intake.logs.datadoghq.com/v1/input/"+req.body.api,
      req.body.text,
      { headers: { "content-type": "application/json" } }
    )
    .then((res) => {
      console.log("res:", res);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = logRouter;
