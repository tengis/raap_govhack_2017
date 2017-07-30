const AWS = require("aws-sdk");

const slack = require("./slackApiWrapers.js");
const queryString = require("querystring");

const stateFunctionName = "govhack_send_state_message";

process.env.TZ = "Australia/Sydney";

function determineCommand(text, details) {
  return new Promise((resolve, reject) => {
    console.log("here is the text to parse?", text);
    resolve();
    // if (text.indexOf("demo") > -1) {
    //   resolve();
    // } else {
    //   reject();
    // }
  });
}

exports.handler = (event, context, callback) => {
  slack.setBotToken(process.env.BOT_TOKEN);
  var requestDetails = queryString.parse(event.body);
  let lambda = new AWS.Lambda();

  determineCommand(requestDetails.text, requestDetails)
    .then(function(parsedCommand) {
      lambda.invoke(
        {
          FunctionName: stateFunctionName,
          Payload: JSON.stringify({
            state: 0,
            user_id: requestDetails.user_id,
            channel_id: requestDetails.channel_id,
            user_name: requestDetails.user_name
          }),
          InvocationType: "Event"
        },
        function(error, data) {
          callback(null, {
            statusCode: "200",
            body:
              "Hey " +
              requestDetails.user_name +
              "! Of course i'll be able to help.",
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
      );
    })
    .catch(err => {
      callback(null, {
        statusCode: "200",
        body:
          "Hey " +
          requestDetails.user_name +
          "! I am currently still studying more regulations. I'll be able to help later! ",
        headers: {
          "Content-Type": "application/json"
        }
      });
    });
};
