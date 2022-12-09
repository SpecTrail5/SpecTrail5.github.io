var express = require('express'),
	actuatorRoutes = require('./../routes/actuators'),
	sensorRoutes = require('./../routes/sensors'),
	cors = require('cors'),
	converter = require('./../middleware/converter'),
	bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/pi/actuators', actuatorRoutes);
app.use('/pi/sensors', sensorRoutes);

app.get('/', function (req, res) {
	res.send('Add "/pi" to the URL!');
});

app.get('/pi', function (req, res) {
	res.send('This is my Pi!');
});

app.use(converter());

module.exports = app;
