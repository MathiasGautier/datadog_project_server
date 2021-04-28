let message = "Lorem ipsum";
let status = "info";
let data = { hello: "world" };
let channel="";

function sendLog(message, data, status) {
  try {
    const url =
      "https://http-intake.logs.datadoghq.com/v1/input/" +
      "1b8e8b18616b10aa3f6b446f9e6222ac";

    const logData = {};
    logData["message"] = message;
    logData["ddsource"] = channel;
    logData["hostname"] = "Mathias";
    logData["status"] = status;
    logData["data"] = data;

    console.log(url, logData);

    axios
      .post(url, logData, { headers: { "content-type": "application/json" } })
      .then((res) => {

        console.log('res', res)
      })
      .catch((error) => {
        console.error('err', error)
      });
  } catch (error) {console.log(error)}
}

sendLog(message, status, data, channel);