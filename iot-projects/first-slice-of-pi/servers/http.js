const express = require('express'),
	cors = require('cors');

	var app = express();
	app.use(cors());
	app.get('/', function(req, res){
		res.send('Why do you want to be here.');
	 });
	 app.get('/pi', function(req, res){
		res.send('Nope.');
	 });

module.exports = app;
// I have looked through all files