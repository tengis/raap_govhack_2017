const request = require("./requestHelpers.js");

const slackApiPath = "slack.com";
const postMessagePath = "/api/chat.postMessage";
const getUserListPath = "/api/users.list";
const imListPath = "/api/im.list";
const imOpenPath = "/api/im.open";

let botToken = "";

function setBotToken(token) {
  botToken = token;
}

function openUserChannels(userList) {
  return new Promise(function(resolve, reject) {
    let totalFinishedUsers = 0;
  });
}

function updateMessage(timestamp, channel, text, attachments) {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: slackApiPath,
      path: "/api/chat.update"
    };

    let body = {
      token: botToken,
      channel: channel,
      text: text,
      ts: timestamp,
      as_user: true
    };

    if (attachments) {
      body.attachments = JSON.stringify(attachments);
    }
    request
      .post(options, body)
      .then(function(res) {
        resolve(res.data);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

function postMessage(textMessage, channel, attachments) {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: slackApiPath,
      path: "/api/chat.postMessage"
    };

    const body = {
      token: botToken,
      channel: channel,
      text: textMessage,
      markdown: true,
      as_user: true,
      attachments: JSON.stringify(attachments)
    };

    request
      .post(options, body)
      .then(function(res) {
        resolve(res.data);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

function getUserList() {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: slackApiPath,
      path: getUserListPath
    };

    const body = {
      token: botToken
    };

    request
      .post(options, body)
      .then(function(res) {
        resolve(res.data.members);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

function getIMchannelList() {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: slackApiPath,
      path: imListPath
    };

    const body = {
      token: botToken
    };

    request
      .post(options, body)
      .then(function(res) {
        resolve(res.data.ims);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

function openChannel(user) {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: slackApiPath,
      path: "/api/im.open"
    };

    const body = {
      token: botToken,
      user: user,
      return_im: true
    };

    request
      .post(options, body)
      .then(function(res) {
        resolve(res.data);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

module.exports = {
  openChannel: openChannel,
  getIMchannelList: getIMchannelList,
  getUserList: getUserList,
  postMessage: postMessage,
  updateMessage: updateMessage,
  setBotToken: setBotToken
};
