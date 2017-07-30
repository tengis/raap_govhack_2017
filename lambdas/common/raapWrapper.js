const rp = require("request-promise");

const BASE_URL = "https://raap.d61.io";
const TOKEN = process.env.GOVHACK_TOKEN;

let isExportAllowedRequirements = {
  Bovine: {
    calf: false
  },
  Secretary: {
    Accredit: {
      Farm: false,
      Feedlot: false,
      Saleyard: false
    },
    accreditPropertyRenew: true,
    enterPropertyOnRegister: true
  },
  //Only real requirement left true for demo
  meatAndMeatProducts: {
    AreForExportToEuropeanUnion: true
  },
  weight: {
    Dressed: 0,
    Live: 0
  }
};

const getToken = () => {
  const opt = {
    method: "POST",
    url: `${BASE_URL}/api/v0/user/token`,
    auth: {
      user: process.env.GOVHACK_USERNAME,
      pass: process.env.GOVHACK_PASSWORD
    }
  };
  return rp(opt);
};

const callReasoner = (payload, token) => {
  const uri = "/api/v0/domain/export-control/reasoning/reason";
  const opt = {
    url: `${BASE_URL}${uri}`,
    method: "POST",
    body: payload,
    json: true,
    headers: {
      Authorization: "Bearer " + token.replace(/['"]+/g, "")
    }
  };
  return rp(opt);
};

const checkConculsion = token => {
  let requiredOutcomes = {
    Bovine: {
      properties: {
        calf: true
      }
    }
  };

  return callReasoner(requiredOutcomes, token);
};

const fullRequirementsList = token => {
  const uri = "/api/v0/domain/export-control/reasoning/input-atoms";
  const opt = {
    url: `${BASE_URL}${uri}`,
    method: "GET",
    json: true,
    headers: {
      Authorization: "Bearer " + token.replace(/['"]+/g, "")
    }
  };
  return rp(opt);
};

const convertCamelCase = camelCased => {
  return camelCased.replace(/([A-Z])/g, " $1").replace(/^./, str => {
    return str.toLowerCase();
  });
};

const prettyFiRequirements = (requirements, desiredRequirement) => {
  let mappedScentences = [];
  let desired = requirements.filter(requirement => {
    if (
      requirement &&
      requirement.goal &&
      requirement.goal.booleanGoal &&
      requirement.goal.booleanGoal.boolRef &&
      requirement.goal.booleanGoal.boolRef
        .toLowerCase()
        .indexOf(desiredRequirement.toLowerCase()) > -1
    ) {
      return requirement;
    }
  });

  if (desired.length) {
    console.log(desired[0]);
    mappedScentences = desired[0].contributingAtoms.map(atom => {
      console.log(atom);

      let splitAtom = atom.split(".");

      console.log("here is our split atom", splitAtom);
      console.log(splitAtom[1]);

      switch (splitAtom[0]) {
        case "Bovine":
          return "Your bovine will need to be a " + splitAtom[1];
          break;
        case "Date":
          return (
            "You will need to provide the date for your " +
            convertCamelCase(splitAtom[1])
          );
          break;
        case "Secretary":
          if (splitAtom.length == 3) {
            return (
              "You will need to ensure you are an accredited" +
              convertCamelCase(splitAtom[2])
            );
          } else {
            return (
              "You will need to ensure you are able to " +
              convertCamelCase(splitAtom[1])
            );
          }
          break;
        case "meatAndMeatProducts":
          return "Please ensure you are eligable to export to the European Union";
          break;
        case "weight":
          return (
            "Please check your animal has a valid " +
            splitAtom[1].toLowerCase() +
            " weight"
          );
          break;
        default:
          break;
      }
    });
  }
  return mappedScentences;
};

function testRun() {
  return getToken()
    .then(token => fullRequirementsList(token))
    .then(requirements => {
      return prettyFiRequirements(requirements, "ExportIsAllowed");
    });
}

module.exports = {
  getToken,
  callReasoner,
  checkConculsion,
  isExportAllowedRequirements,
  fullRequirementsList,
  prettyFiRequirements
};

// testRun().then(result => {
//   console.log("our final test results", result);
// });
