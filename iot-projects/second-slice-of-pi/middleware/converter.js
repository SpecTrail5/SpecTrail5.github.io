var json2html = require('node-json2html');

module.exports = function() {
	return function (req, res, next) {
		if (req.result) {
			if (req.accepts('html')) {
				var transform = {'<>': 'div', 'html': [
					{'<>': 'p', 'html': [
						{'<>': 'b', 'html': 'Name: '},
						{'<>': 'p', 'html': '${name}'}
					]},
					{'<>': 'p', 'html': [
						{'<>': 'b', 'html': 'Description: '},
						{'<>': 'p', 'html': '${description}'}
					]},
					{'<>': 'p', 'html': [
						{'<>': 'b', 'html': 'Value: '},
						{'<>': 'p', 'html': '${value}'}
					]},
				]};
				console.log("sending html");
				res.send(json2html.transform(req.result, transform));
				return;
			}
			console.log("sending json");
			res.send(req.result);
		}

		console.log("sending nothing");
		next();
	};
};
