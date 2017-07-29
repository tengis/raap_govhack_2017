const express = require("express");
const cors = require("cors");
const hackedHost = "54.79.19.249";

const app = express();
app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, hackedHost, function() {
  console.log("Example app listening on port 3000!");
});
