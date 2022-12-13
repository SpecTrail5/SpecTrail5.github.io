var resources = require('./../../resources/model');

var sensor;
var device = resources.pi.sensors.pir;
var pluginName = resources.pi.sensors.pir.name;


exports.start = function (params) {
	connectHardware();
	console.log("starting " + pluginName + " plugin");
};

exports.stop = function () {
	sensor.unexport();
	console.info(pluginName + " plugin stopped!");
};

function connectHardware() {
	var Gpio = require('onoff').Gpio;
	sensor = new Gpio(device.gpio, 'in', 'both');
	sensor.watch(function (err, value) {
		if (err) {
			exit(err);
		}
		device.value = !!value;
		//console.log(model.value ? "Detected something!" : "Detecting nothing!");
	});
}

