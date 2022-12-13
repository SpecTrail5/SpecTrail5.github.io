var httpServer = require('./servers/http'),
	resources = require('./resources/model');

var pirPlugin = require('./plugins/internal/pirPlugin'),
	dhtPlugin = require('./plugins/internal/dhtPlugin');

pirPlugin.start({});
dhtPlugin.start({'frequency': 2000});

resources.pi.port = 8686;

var server = httpServer.listen(resources.pi.port, function () {
	console.log("Running the Pi on port " + resources.pi.port);
});

process.on('SIGINT', function () {
	pirPlugin.stop();
	dhtPlugin.stop();
	process.exit();
});
