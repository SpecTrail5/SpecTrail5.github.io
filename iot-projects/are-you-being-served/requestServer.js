// requestServer.js file

var args = process.argv.slice(2);
const http = require("http");
const request = require("request");
var port = 5840;

// example http server creation
http
  .createServer(function (req, res) {
     var url = args[0] ? args[0] : "https://spectrail5.github.io/";
    request(url, function (error, response, body) {
      if (
        !body ||
        !response ||
        (error === null && response.statusCode !== 200)
      ) {
        res.end("bad URL\n");
        return;
      }

      if (response.statusCode === 200 && !error === true) {
        res.writeHead(200, { "content-type": url });
        res.write("Yes, come on in,");
        res.write(" but please leave. ");
        res.end(url);
      } else {
        res.writeHead(response.statusCode, { "content-type": "text/plain" });
        res.write(error.toString());
        res.end(", oh well");
      }
    });
  })
  .listen(port);
  
