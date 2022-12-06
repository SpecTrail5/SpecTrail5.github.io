var sensorRoutes = require("./../routes/sensors");
var actuatorRoutes = require("./../routes/actuators");
const express = require("express"),
  cors = require("cors");

var app = express();
app.use(cors());
app.use("/pi/sensors", sensorRoutes);
app.get("/", function (req, res) {
  res.send("Why do you want to be here.");
});
app.get("/pi", function (req, res) {
  res.send("Nope.");
});
app.use("/pi/actuators", actuatorRoutes);

module.exports = app;
// I have looked through all files
