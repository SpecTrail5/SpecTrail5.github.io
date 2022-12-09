var express = require('express'),
	router = express.Router(),
	resources = require('./../resources/model');

router.route('/').get(function (req, res, next) {
	req.result = resources.pi.sensors;
	next();
});

router.route('/pir').get(function (req, res, next) {
	req.result = resources.pi.sensors.pir;
	next();
});

router.route('/dht').get(function (req, res, next) {
	req.result = resources.pi.sensors.dht;
	next();
});

router.route('/dht/temperature').get(function (req, res, next) {
	req.result = resources.pi.sensors.dht.temperature;
	next();
});

router.route('/dht/humidity').get(function (req, res, next) {
	req.result = resources.pi.sensors.dht.humidity;
	next();
});

module.exports = router;

