const AWS = require("aws-sdk");
const slackApi = require("./slackApiWrapers");
const queryString = require("querystring");

const possibleStates = {
  0: {
    stateGroup: "accreditation",
    text: "Do you have the proper accreditation for a farm?",
    optionType: "twoChoice",
    optionName: "farmAcred",
    checkList: "Farm accreditation",
    validateResponse: value => {
      if (value === "yes") {
        return true;
      } else {
        return false;
      }
    },
    nextState: 1
  },
  1: {
    stateGroup: "accreditation",
    text: "Do you have the proper accreditation to operate as a feedlot?",
    optionType: "twoChoice",
    optionName: "feedlotAcred",
    checkList: "Feedlot accreditation",
    validateResponse: value => {
      if (value === "yes") {
        return true;
      } else {
        return false;
      }
    },
    nextState: 2
  },
  2: {
    stateGroup: "accreditation",
    text: "Do you have the proper accreditation to operate as a sale yard?",
    optionType: "twoChoice",
    optionName: "saleYardAcred",
    checkList: "Saleyard accreditation",
    validateResponse: value => {
      if (value === "yes") {
        return true;
      } else {
        return false;
      }
    },
    nextState: 3
  },
  3: {
    stateGroup: "animalDetails",
    text: "Is your bovine a calf?",
    optionType: "twoChoice",
    optionName: "bovineCalf",
    checkList: "Bovine calf",
    validateResponse: value => {
      if (value === "yes") {
        return true;
      } else {
        return false;
      }
    },
    nextState: 4
  },
  4: {
    stateGroup: "animalDetails",
    text: "What is the dressed weight of your animal?",
    optionType: "multiSelectWeight",
    optionName: "dressedWeight",
    checkList: "Dressed weight",
    validateResponse: weight => {
      if (weight === "300-350") {
        return true;
      } else {
        return false;
      }
    },
    nextState: 5
  },
  5: {
    stateGroup: "animalDetails",
    text: "What is the live weight of your animal?",
    optionType: "multiSelectWeight",
    optionName: "liveWeight",
    checkList: "Live weight",
    validateResponse: weight => {
      if (weight === "300-350") {
        return true;
      } else {
        return false;
      }
    },
    nextState: 6
  },
  6: {
    stateGroup: "schedulingTime",
    text: "Have you provided atleast 2 weeks notice?",
    optionType: "twoChoice",
    optionName: "scheduleNotice",
    checkList: "Enough scheduled notice",
    validateResponse: value => {
      if (value === "yes") {
        return true;
      } else {
        return false;
      }
    },
    nextState: 10
  },
  10: {
    stateGroup: "done",
    text:
      "Congratulations you are eligable to export under the European Union Cattle Accreditation Scheme! :bowtie:",
    optionType: "done",
    optionName: "done",
    checkList: "Done!",
    validateResponse: value => {
      return true;
    },
    nextState: "complete"
  }
};

function generateQuestionPrompt(state, user) {
  const currentState = possibleStates[state];
  console.log("here is our current state", currentState);
  let baseTemplate = {
    fallback: "You don't know what to do?",
    callback_id: user + ":" + state + ":" + currentState.nextState,
    color: "#3AA3E3",
    attachment_type: "default",
    text: currentState.text
  };
  switch (currentState.optionType) {
    case "twoChoice":
      baseTemplate.actions = [
        {
          name: currentState.optionName,
          text: "Yes",
          type: "button",
          value: "yes"
        },
        {
          name: currentState.optionName,
          text: "No",
          type: "button",
          value: "no"
        }
      ];
      break;
    case "multiSelectWeight":
      baseTemplate.actions = [
        {
          name: "weight_selection",
          text: "Select a weight group",
          type: "select",
          options: [
            {
              text: "less than 150kg",
              value: "less"
            },
            {
              text: "150-200 kg",
              value: "less"
            },
            {
              text: "250-300 kg",
              value: "less"
            },
            {
              text: "300-350 kg",
              value: "300-350"
            },
            {
              text: "350-400 kg",
              value: "more"
            },
            {
              text: "400-450 kg",
              value: "more"
            },
            {
              text: "greater than 450kg",
              value: "more"
            }
          ]
        }
      ];
      break;
    default:
      break;
  }
  return [baseTemplate];
}

function postInteractiveStateMessage(state, user, channel, text) {
  const baseTemplate = generateQuestionPrompt(state, user);
  return slackApi.postMessage(text, channel, baseTemplate);
}

function updatePreviousState(previousState, value) {
  const details = possibleStates[previousState];
  switch (value) {
    case "no":
      return details.checkList + " :x:";
    case "yes":
      return details.checkList + " :white_check_mark:";
    case "less":
      return details.checkList + " too light :x:";
    case "more":
      return details.checkList + " too heavy :x:";
    case "300-350":
      return details.checkList + "valid :white_check_mark:";
    default:
      return;
  }
}

function postErrorStateMessage(state, user, channel) {
  const errorTemplate = {
    fallback: "You don't know what to do?",
    callback_id: user + ":done:done",
    color: "#3AA3E3",
    attachment_type: "default",
    text: "Hey to meet this accreditation you'll require the following:"
  };
  return slackApi.postMessage("", channel, [errorTemplate]);
}

exports.handler = (event, context, callback) => {
  slackApi.setBotToken(process.env.BOT_TOKEN);
  if (event.state === 0 && event.channel_id) {
    postInteractiveStateMessage(
      0,
      event.user_name,
      event.channel_id,
      "Hey " + event.user_name + " i'll be more than happy to assist."
    ).then(() => {
      callback();
    });
  } else {
    console.log("we have been transfered here with the payload", event);
    const payLoadSections = event.callback_id.split(":");
    if (payLoadSections.length === 1) {
      console.log("finishing state.");
      callback();
    } else {
      const previousState = payLoadSections[1];
      const nextState = payLoadSections[2];
      const responseValue = event.actions[0];

      let parsedResponseValue = "";

      if (responseValue.type && responseValue.type == "select") {
        parsedResponseValue = responseValue.selected_options[0].value;
      } else {
        parsedResponseValue = responseValue.value;
      }

      return slackApi
        .updateMessage(
          event.message_ts,
          event.channel.id,
          updatePreviousState(previousState, parsedResponseValue)
        )
        .then(() => {
          if (
            !possibleStates[previousState].validateResponse(parsedResponseValue)
          ) {
            return postErrorStateMessage(
              previousState,
              event.user.name,
              event.channel.id
            );
          } else {
            return postInteractiveStateMessage(
              nextState,
              event.user.name,
              event.channel.id,
              ""
            );
          }
        })
        .then(() => {
          callback();
        })
        .catch(err => {
          console.log("[ERROR] ending the chain", err);
          callback();
        });
    }
  }
};
