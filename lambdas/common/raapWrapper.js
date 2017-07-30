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
  console.log("here is our opt?", opt);
  return rp(opt);
};

const checkConculsion = token => {
  let requiredOutcomes = {
    Bovine: {
      properties: {
        calf: true
      }
    }
    // "Date.renewalNoticeGivenToPropertyManager" : true,
    // "Date.today": true,
    // "Secretary.Accredit.Farm": true,
    // "Secretary.Accredit.Feedlot": true,
    // "Secretary.Accredit.Saleyard": true,
    // "Secretary.accreditPropertyRenew": true,
    // "Secretary.enterPropertyOnRegister": true,
    // "meatAndMeatProducts.AreForExportToEuropeanUnion": true,
    // "weight.Dressed": 300,
    // "weight.Live": 400
  };

  return callReasoner(requiredOutcomes, token);
};

module.exports = {
  getToken,
  callReasoner,
  checkConculsion,
  isExportAllowedRequirements
};
