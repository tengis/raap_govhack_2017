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

app.post("/event", function(req, res) {
  const slackEventDetails = req.body;
  console.log("event details", slackEventDetails);
  if (
    slackEventDetails.event &&
    !slackEventDetails.event.bot_id &&
    slackEventDetails.event.user &&
    !(slackEventDetails.event.user in slackState)
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

app.post("/interactive", function(req, res) {
  const details = req.body;
  console.log("the interactive message details", details);
});

app.listen(3000, "0.0.0.0", function() {
  console.log("Example app listening on port 3000!");
});
