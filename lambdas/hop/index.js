const AWS = require("aws-sdk");
const queryString = require("querystring");
const functionName = "govhack_send_state_message";

exports.handler = (event, context, callback) => {
  var requestDetails = JSON.parse(queryString.parse(event.body).payload);
  console.log("our request details", requestDetails);
  let lambda = new AWS.Lambda();

  lambda.invoke(
    {
      FunctionName: functionName,
      Payload: JSON.stringify(requestDetails),
      InvocationType: "Event"
    },
    function(error, data) {
      callback(null, {
        statusCode: "200",
        body: "One moment . . .",
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  );
};
