const http = require("http");
const async = require("async");

const port = 8686;

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });

    let racers = ["Green Ambler", "Catalack", "Steel Runner", "G.I. Jogger"];

    // TODO 7: Get the start time for the race

    let d = new Date();
    let startTime = d.getTime();

    // TODO 12: Make the whole thing parallel
    async.series(
      // TODO 9: Supply an array of functions
      [
        function one(callback) {
          wrapper(callback);
        },
        function two(callback) {
          wrapper(callback);
        },
        function three(callback) {
          wrapper(callback);
        },
        function four(callback) {
          wrapper(callback);
        },
      ],
      function (error, results) {
        // TODO 10: add a callback function to the end of the async call to tally the results
        res.write("Results:\n");

        var victoryOrder = sortTogether(racers, results);
      }
    );
  })
  .listen(port);

// TODO 8: create a common function to be called by all functions in the array passed to the async function
function wrapper(callback) {
  setTimeout(function () {
    var d = new Date();

    callback(null, d.getTime());
  }, Math.random() * 1000);
}

// sortTogether takes in an array of racer names and an array of times that the racers finished the race.
// It returns a new array of names, with the list or racers sorted by the time that they finished.
function sortTogether(names, times) {
  var tempList = [];
  for (var i = 0; i < names.length; i++) {
    tempList.push({ name: names[i], time: times[i] });
  }

  tempList.sort(function (a, b) {
    return a.time < b.time ? -1 : a.time == b.time ? 0 : 1;
  });

  for (var i = 0; i < tempList.length; i++) {
    names[i] = tempList[i].name;
  }
  return names;
}
