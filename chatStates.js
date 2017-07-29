const slackApi = require("./slackApiWrapers");

function startState(user, channel, text) {
  console.log("entered start state with user", user);
  return slackApi.postMessage("hello there!", channel, []);
}

module.exports = {
  startState: startState
};
