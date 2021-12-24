var express = require("express");
var metricRouter = express.Router();
const axios = require("axios");
const logger = require("../config/logger");

metricRouter.post("/post_metrics", (req, res) => {

  if (req.body.metricObject.checkRepeat === false) {
    console.log(req.body.metricObject.tagList)
    axios
      .post(
        "https://api.datadoghq.com/api/v1/series/",
        {
          series: [
            {
              metric: req.body.metricObject.metricName,
              points: [
                [
                  Number(
                    Date.now().toString().split("").splice(0, 10).join("")
                  ),
                  Number(req.body.metricObject.metricValue),
                ],
              ],
              tags: req.body.metricObject.tagList
            },
          ],
        },
        {
          headers: {
            "content-type": "text/json",
            "DD-API-KEY": req.body.metricObject.apiKey,
          },
        }
      )
      .then((document) => {
        console.log(document.config);
        logger.log("info", "Sent metric", req.body.metricObject.username);
        res.send(
          JSON.stringify(document.config.data, null, "\t")
        )

        res.status(200);
      })
      .catch((error) => {
        logger.log("info", "Fail to send metric", error);
        console.log(error);
        res.status(500).json(error);
      });
  }

  if (req.body.metricObject.checkRepeat === true) {
    axios
      .post(
        "https://api.datadoghq.com/api/v1/series/",
        {
          series: [
            {
              metric: req.body.metricObject.metricName,
              points: [
                [
                  Number(
                    Date.now().toString().split("").splice(0, 10).join("")
                  ),
                  Number(req.body.metricObject.value),
                ],
              ],
              tags: req.body.metricObject.tagList
            },
          ],
        },
        {
          headers: {
            "content-type": "text/json",
            "DD-API-KEY": req.body.metricObject.apiKey,
          },
        }
      )
      .then((document) => {
        console.log(document);
        logger.log("info", "Sent metric", req.body.metricObject.username);
        // res.status(200).json(document);
        res.send(JSON.stringify(document.config.data, null, "\t"))

        res.status(200);
      })
      .catch((error) => {
        logger.log("info", "Fail to send metric", error);
        console.log(error);
        res.status(500).json(error);
      });
  }
});

module.exports = metricRouter;
