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
    body: payload,
    json: true,
    headers: {
      Authorization: "Bearer " + token.replace(/['"]+/g, "")
    }
  };
  return rp(opt);
};

const prettyFiRequirements = requirements => {};

module.exports = {
  getToken,
  callReasoner,
  checkConculsion,
  isExportAllowedRequirements
};
