/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  // game variables

  var boardWidthmax = $("#board").width()

  var boardWidthmin = $("#board").width() - $("#board").width()
  var boardHeightmax = $("#board").height()
  var boardHeightmin = $("#board").height() - $("#board").height()
  var point1 = 0
  var point2 = 0



  // Game Item Objects
  var ball = {
    spdX: 5,
    spdY: 5,
    posX: 375,
    posY: 180
  }

  var KEY = {
    //blue paddle control
    w: 87,
    a: 65,
    s: 83,
    d: 68,
    //red paddle control
    up: 38,
    left: 37,
    down: 40,
    right: 39
  }
  //blue paddle
  var pad1 = {
    spdY: 0,
    posY: 150,
    posx: $("#pad1").width()
  }
  //red paddle
  var pad2 = {
    spdY: 0,
    posY: 150
  }



  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    moveGameItems()
    redraw();
    ballBorder()
  }

  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {

    if (event.which === KEY.w) {
      pad1.spdY = -5

    }
    if (event.which === KEY.s) {
      pad1.spdY = 5
    }

    if (event.which === KEY.up) {
      pad2.spdY = -5
    }
    if (event.which === KEY.down) {
      pad2.spdY = 5
    }

  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function moveGameItems() {

    ball.posX += ball.spdX
    ball.posY += ball.spdY

    pad1.posY += pad1.spdY

    pad2.posY += pad2.spdY

  }

  function ballBorder() {
    // ball Y board 
    if (ball.posY === boardHeightmax - 50) {
      ball.spdY = ball.spdY * -1
    }
    if (ball.posY === boardHeightmin) {
      ball.spdY = ball.spdY * -1
    }
    // ball X board
    if (ball.posX === boardWidthmax - 50) {
      ball.spdX = ball.spdX * -1
    }
    if (ball.posX === boardWidthmin) {
      ball.spdX = ball.spdX * -1
    }
    if (pad1.posY > boardHeightmax) {
      pad1.spdY = 0
    }

  }





  function redraw() {

    $("#ball").css('left', ball.posX)
    $("#ball").css('top', ball.posY)

    $("#pad1").css('top', pad1.posY)
    $("#pad2").css('top', pad2.posY)
  }


  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

}



