const rp = require("request-promise");

const BASE_URL = "https://raap.d61.io";
const TOKEN = process.env.GOVHACK_TOKEN;

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
      Authorization: `Bearer ${token}`
    }
  };
  return rp(opt);
};

module.exports = {
  getToken,
  callReasoner
};
