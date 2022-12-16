var httpServer = require("./servers/http"),
  resources = require("./resources/model");

var pirPlugin = require("./plugins/internal/pirPlugin"),
  dhtPlugin = require("./plugins/internal/dhtPlugin"),
  ledsPlugin = require("./../plugins/internal/ledsPlugin");

pirPlugin.start({});
dhtPlugin.start({ frequency: 2000 });
ledsPlugin.start({});

resources.pi.port = 8686;

var server = httpServer.listen(resources.pi.port, function () {
  console.log("Running the Pi on port " + resources.pi.port);
});

process.on("SIGINT", function () {
  pirPlugin.stop();
  dhtPlugin.stop();
  ledsPlugin.stop();
  process.exit();
});
