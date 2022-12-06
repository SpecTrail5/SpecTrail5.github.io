const express = require('express'),
	router = express.Router(),
	resources = require('./../resources/model');

	router.route("/").get(function (req, res, next) {
		res.send(resources.pi.actuators);
	  });
	  router.route("/leds").get(function (req, res, next) {
		res.send(resources.pi.actuators);
	  });
	  router.route("/leds/:id").get(function (req, res, next) {
		res.send(resources.pi.actuators.leds[req.params.id]);
	  });
	  
	

module.exports = router;
