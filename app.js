const express = require("express");
const cors = require("cors");
const hackedHost = "54.79.19.249";
const bodyParser = require("body-parser");
const chatStates = require("./chatStates");
const slackApi = require("./slackApiWrapers");
const slackState = {};

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.BOT_TOKEN) {
  slackApi.setBotToken(process.env.BOT_TOKEN);
  console.log("we have set our bot token.");
}

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.post("/slackEntry", function(req, res) {
  console.log("we have entered into the slack entry.", req.body);
});

app.post("/event", function(req, res) {
  console.log("we have entered into the slack entry.", req.body);
  const slackEventDetails = req.body;
  if (
    slackEventDetails.event &&
    slackEventDetails.event.user &&
    !slackEventDetails.event.user
  ) {
    slackState[slackEventDetails.event.user] = {
      state: 0
    };

    const messageTemplate = chatStates.startState(
      slackEventDetails.event.user,
      slackEventDetails.event.channel,
      slackEventDetails.event.text
    );
  }
});

app.listen(3000, "0.0.0.0", function() {
  console.log("Example app listening on port 3000!");
});
