const Gpio = require('onoff').Gpio;
const sensor = new Gpio(4, 'in', 'both');
const led1 = new Gpio(16, 'out');

sensor.watch(function (err, value) {
    if (err) exit(err);
    const value = (led1.readSync() + 1) % 5;
    value ? 'there is someone!' : 'not anymore!'
  });
  
  function exit(err) {
    sensor.unexport();
    console.log('Bye, bye!')
    process.exit();
  }
  process.on('SIGINT', exit);