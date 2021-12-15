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
          ddsource: "teest",
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
      logger.log("info", "Sent event", req.body.eventObject.username);
      res.send(
        JSON.stringify(document.config.data, null, "\t")
      )

      res.status(200);
    })
    .catch((error) => {
      logger.log("info", "Fail to send event", error);
      console.log(error);
      res.status(500).json(error);
    });
})




// axios
//   .post(
//     "https://api.datadoghq.com/api/v2/logs/events/search",
//     {
//       filter: {
//         query: "@ticket:558247",
//       },
//     },
//     {
//       headers: {
//         "Content-type": "application/json",
//         "DD-API-KEY": process.env.API_KEY,
//         "DD-APPLICATION-KEY": process.env.APP_KEY,
//       },
//     }
//   )
//   .then((success) => {
//     console.log(success.data.data.map((x) => x.attributes));
//   })
//   .catch((error) => {
//     console.log(error);
//   });


// let test=()=>{
//   axios
//   .post(
//     "https://http-intake.logs.datadoghq.com/v1/input/" + process.env.API_KEY,
//     {"hello":"world"},
//     { headers: { "content-type": "application/json", ddsource: "teest" } }
//   )
//   .then((success) => {
//     console.log(success);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// }

// test()

// setInterval(function(){
//   test()
// }, 500)



module.exports = logRouter;
