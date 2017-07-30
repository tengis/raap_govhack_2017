const AWS = require("aws-sdk");
const slackApi = require("./slackApiWrapers");
const queryString = require("querystring");
const raap = require("./raapWrapper");

const possibleStates = {
  0: {
    stateGroup: "accreditation",
    text: "Do you have the proper accreditation for a farm?",
    optionType: "twoChoice",
    optionName: "farmAcred",
    checkList: "Farm accreditation",
    contributingFactor: {
      Secretary: {
        Accredit: {
          Farm: true
        }
      }
    },
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
    contributingFactor: "Secretary.Accredit.Feedlot",
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
    contributingFactor: "Secretary.Accredit.Saleyard",
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
    contributingFactor: "Bovine.calf",
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
    text:
      "What is the dressed weight of your animal? (Valid weight 300-350 kgs)",
    optionType: "multiSelectWeight",
    optionName: "dressedWeight",
    checkList: "Dressed weight",
    contributingFactor: "weight.Dressed",
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
    text: "What is the live weight of your animal? (Valid weight 300-350 kgs)",
    optionType: "multiSelectWeight",
    optionName: "liveWeight",
    checkList: "Live weight",
    contributingFactor: "weight.Live",
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
    checkList: "sufficient scheduled notice",
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
    text: `
    Congratulations you are eligible to export under the European Union Cattle Accreditation Scheme! :bowtie: \n
Please print and fill out the following form and return it to the government: https://ablis.business.gov.au/AG/resource/AP242.pdf
    `,
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
      return details.checkList + " valid :white_check_mark:";
    default:
      return;
  }
}

function determineValidRaapState() {}

function postErrorStateMessage(state, user, channel) {
  const errorTemplate = {
    fallback: "You don't know what to do?",
    callback_id: user + ":done:done",
    color: "#f44141",
    attachment_type: "default",
    text: `
    Looks like your are currently not eligible to apply for the EUCAS Accreditation, for more information on the scheme, please visit this page:\n https://www.mla.com.au/globalassets/mla-corporate/blocks/research-and-development/34007_mla_eu-cattle-tt_vfa2_webv2.pdf
    `
  };
  return slackApi.postMessage("", channel, [errorTemplate]);
}

function generateGreetingMessage(username) {
  return `Congratulations! You may be eligible for the EUCAS Accreditation which will allow you to export your cattle to the EU. \n\nFor an overview of the scheme check out this page here: \nhttps://www.mla.com.au/globalassets/mla-corporate/blocks/research-and-development/34007_mla_eu-cattle-tt_vfa2_webv2.pdf
\n\nAnswer some of the questions below to check your eligibility.`;
}

function determineConculsionMet(model) {
  return new Promise((resolve, reject) => {
    resolve();
    // raap
    //   .getToken()
    //   .then(token => {
    //     raap.checkConculsion(token);
    //   })
    //   .then(response => {
    //     let parsed = response.ExportIsAllowed;
    //     console.log("here is our parsed response", parsed);
    //     resolve();
    //   });
  });
}

function constructCurrentModel(responseValue, previousState, currentState) {
  let baseSchema = raap.isExportAllowedRequirements;
  return baseSchema;
}

function determineNextStateQuestion(event, callback) {
  return new Promise((resolve, reject) => {
    const payLoadSections = event.callback_id.split(":");
    if (payLoadSections.length === 1) {
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
  });
}

exports.handler = (event, context, callback) => {
  slackApi.setBotToken(process.env.BOT_TOKEN);
  if (event.state === 0 && event.channel_id) {
    postInteractiveStateMessage(
      0,
      event.user_name,
      event.channel_id,
      generateGreetingMessage(event.user_name)
    ).then(() => {
      callback();
    });
  } else {
    const payLoadSections = event.callback_id.split(":");
    const previousState = payLoadSections[1];
    const nextState = payLoadSections[2];
    const responseValue = event.actions[0];

    determineConculsionMet(
      constructCurrentModel(responseValue, previousState, nextState)
    ).then(() => determineNextStateQuestion(event, callback));
  }
};
