var pirPlugin = require("./plugins/internal/pirPlugin");
var dhtPlugin = require("./plugins/internal/dhtPlugin");

const httpServer = require("./servers/http"),
  resources = require("./resources/model");

pirPlugin.start({});
dhtPlugin.start({ frequency: 2000 });

const server = httpServer.listen(resources.pi.port, function () {
  console.log("Running the Pi on port " + resources.pi.port);
});

process.on("SIGINT", function () {
  pirPlugin.stop();
  dhtPlugin.stop();
  process.exit();
});
