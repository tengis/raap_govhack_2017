const raap = require("./raapWrapper");

function elicitIntent(sessionAttributes, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: "ElicitIntent",
      message
    }
  };
}

function confirmIntent(slots, message) {
  return {
    dialogAction: {
      type: "ConfirmIntent",
      message,
      intentName: "ExportLiveBovine",
      slots
    }
  };
}

function close(sessionAttributes, fulfillmentState, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: "Close",
      fulfillmentState,
      message,
      responseCard: {
        version: 1,
        contentType: "application/vnd.amazonaws.card.generic",
        genericAttachments: [
          {
            title: "hey hwy hwy",
            subTitle: "hey he yhey",
            imageUrl:
              "https://c1.staticflickr.com/3/2600/3933401042_19d22bddbb.jpg",
            attachmentLinkUrl:
              "https://www.mla.com.au/globalassets/mla-corporate/blocks/research-and-development/34007_mla_eu-cattle-tt_vfa2_webv2.pdf"
          }
        ]
      }
    }
  };
}

// --------------- Events -----------------------

function dispatch(intentRequest, callback) {
  console.log(intentRequest);
  const sessionAttributes = intentRequest.sessionAttributes;
  const slots = intentRequest.currentIntent.slots;
  const confirmationStatus = intentRequest.currentIntent.confirmationStatus;

  console.log("SLOTS", slots);

  callback(
    close(sessionAttributes, "Fulfilled", {
      contentType: "PlainText",
      content: "Woohooo"
    })
  );
}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
  try {
    dispatch(event, response => {
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};
