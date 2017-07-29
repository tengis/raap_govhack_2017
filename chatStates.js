const slackApi = require("./slackApiWrapers");

const possibleStates = {
  0: {
    stateGroup: "accreditation",
    text: "Do you have the proper accreditation for a farm?",
    optionType: "twoChoice",
    optionName: "farmAcred",
    nextState: 1
  }
};

function generateQuestionPrompt(state, user) {
  let baseTemplate = {
    fallback: "You don't know what to do?",
    callback_id: user + ":0",
    color: "#3AA3E3",
    attachment_type: "default",
    text: possibleStates[state].text
  };
  switch (optionType) {
    case "twoChoice":
      baseTemplate.actions = [
        {
          name: possibleStates[state].optionName,
          text: "Yes",
          type: "button",
          value: 0
        },
        {
          name: possibleStates[state].optionName,
          text: "No",
          type: "button",
          value: 1
        }
      ];
      break;
    default:
      break;

      return baseTemplate;
  }
}

function postInteractiveStateMessage(state, user, channel, text) {
  console.log("entered start state with user", user);
  return slackApi.postMessage(text, channel, [
    generateQuestionPrompt(state, user)
  ]);
}

module.exports = {
  startState: startState
};
