const express = require("express");
const cors = require("cors");
const hackedHost = "54.79.19.249";
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.post("/slackEntry", function(req, res) {
  console.log("we have entered into the slack entry.", req.body);
});

app.post("/event", function(req, res) {
  console.log("we have entered into the slack entry.", req.body);
  const slackEventDetails = req.body;
});

app.listen(3000, "0.0.0.0", function() {
  console.log("Example app listening on port 3000!");
});
