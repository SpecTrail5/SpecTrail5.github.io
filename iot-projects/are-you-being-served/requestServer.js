// requestServer.js file
const http = require("http");
const request = require("request");
var port = 9480;

// example http server creation
http.createServer(function (req, res) {
    request("https://github.com/SpecTrail5/SpecTrail5.github.io", function (error, response, body) {
  if (!body || !response || (error === null && response.statusCode !== 200)) {
    res.end("bad URL\n");
    return;
  }

  if(response.statusCode === 200 && !error === true){
    res.writeHead(200, {'content-type': 'text/html'});
    res.write('Yes, come on in,')
    res.end(' but please leave.')
  }else{
    res.writeHead(response.statusCode, {'content-type': 'text/plain'});
    res.write(error.toString())
    res.end(', oh well')
  }

});

}).listen(port);


