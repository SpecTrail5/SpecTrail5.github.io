const http = require("http");
const port = 1111;

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write("all ");
  res.write('or ')
  res.end("nothing!!");
}).listen(port);