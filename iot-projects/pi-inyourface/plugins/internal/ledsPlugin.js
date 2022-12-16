const resources = require("./../../resources/model");

let actuator1, actuator2;
let model = resources.pi.actuators.leds;
let pluginName =
  resources.pi.actuators.leds[1].name +
  ", " +
  resources.pi.actuators.leds[2].name;

exports.start = function (params) {
  connectHardware();
  console.log("starting " + pluginName + " plugin");
};

// TODO 1: Complete the ledsPlugin!

function connectHardware() {
  var Gpio = require("onoff").Gpio;
  sensor = new Gpio(device.gpio, "in");
  actuator1 = new Gpio(model[1].gpio, "out");
  actuator2 = new Gpio(model[2].gpio, "out");
  sensor.watch(function (err, value) {
    if (err) {
      exit(err);
    }
    device.value = !!value;
  });
}

function stop() {
  actuator1.write(0);
  actuator2.write(0);
  actuator1.unexport();
  actuator2.unexport();
}

exports.switchOnOff = {
  1: function (value) {
    if (value === 0) {
      actuator1.write(1);
    } else if (value === 1) {
      actuator1.write(0);
    }
  },
  2: function (value) {
    if (value === 0) {
      actuator2.write(1);
    } else if (value === 1) {
      actuator2.write(0);
    }
  },
};
