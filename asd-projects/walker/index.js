/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
    "LEFT": 37,
    "UP": 38,
    "RIGHT": 39,
    "DOWN": 40,
    "w": 87,
    "a": 65,
    "s": 83,
    "d": 68,
    "space": 32,
    "shift": 16
  }

  var positionX = 0; // the x-coordinate location for the walker
  var positionY = 0; // the Y-coordinate location for the walker
  var posX = 600; // the x-coordinate location for the walker
  var posY = 600; // the Y-coordinate location for the walker
  var speedX = 0; // the speed for the walker along the x-axis
  var speedY = 0; // the speed for the walker along the Y-axis
  var broadWidth = 600
  var broadHeight = 600
  var P1 = {
    "posX": positionX,
    "posY": positionY,
    "spdX": speedX,
    "spdY": speedY

  }
  var P2 = {
    "posX": posX,
    "posY": posY,
    "spdX": speedX,
    "spdY": speedY


  }
  // Game Item Objects


  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keyup', handleKeyup);

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {

    repositionGameItem();
    redrawGameItem();
    border();
    tag()

  }

  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {



    if (event.which === KEY.LEFT) {
      P1.spdX = -5;

    } else if (event.which === KEY.UP) {
      P1.spdY = -5;

    } else if (event.which === KEY.RIGHT) {
      P1.spdX = 5;

    } else if (event.which === KEY.DOWN) {
      P1.spdY = 5;

    }

    if (event.which === KEY.a) {
      P2.spdX = -10;

    } else if (event.which === KEY.w) {
      P2.spdY = -10;

    } else if (event.which === KEY.d) {
      P2.spdX = 10;

    } else if (event.which === KEY.s) {
      P2.spdY = 10;

    }

    if (event.which === KEY.space) {
      var teleportX = Math.random() * 550;
      var teleportY = Math.random() * 550;
      P1.posX = teleportX
      P1.posY = teleportY
    }

  }

  function handleKeyup(event) {

    if (event.which === KEY.LEFT) {
      P1["spdX"] = 0;

    } else if (event.which === KEY.UP) {
      P1["spdY"] = 0;

    } else if (event.which === KEY.RIGHT) {
      P1["spdX"] = 0;

    } else if (event.which === KEY.DOWN) {
      P1["spdY"] = 0;

    }

    if (event.which === KEY.a) {
      P2["spdX"] = 0;

    } else if (event.which === KEY.w) {
      P2["spdY"] = 0;

    } else if (event.which === KEY.d) {
      P2["spdX"] = 0;

    } else if (event.which === KEY.s) {
      P2["spdY"] = 0;

    }

  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function repositionGameItem() {

    P1["posX"] += P1["spdX"]
    P1["posY"] += P1["spdY"]

    P2["posX"] += P2["spdX"]
    P2["posY"] += P2["spdY"]

  }
  function border() {
    if (P1["posX"] < 0) {
      P1["posX"] = broadWidth

    } else if (P1["posX"] > broadWidth) {
      P1["posX"] = 0
    } else if (P1["posY"] < 0) {
      P1["posY"] = broadHeight
    } else if (P1["posY"] > broadHeight) {
      P1["posY"] = 0
    }
    if (P2["posX"] < 0) {
      P2["posX"] = broadWidth

    } else if (P2["posX"] > broadWidth) {
      P2["posX"] = 0
    } else if (P2["posY"] < 0) {
      P2["posY"] = broadHeight
    } else if (P2["posY"] > broadHeight) {
      P2["posY"] = 0
    }
  }


  function redrawGameItem() {
    $("#walker").css("left", P1["posX"])
    $("#walker").css("top", P1["posY"])
    $("#runner").css("left", P2["posX"])
    $("#runner").css("top", P2["posY"])

  }

  function tag() {
    if ((P1.posX + P1.posY) === (P2.posX + P2.posY)) {
      endGame();

    }


  }
  $("#GO").css("color", "black");

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    $("#GO").css("color", "red");
    // turn off event handlers
    $(document).off();
  }

}
