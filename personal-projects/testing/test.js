$(document).ready(runTest);

function runTest() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  // game variables

  var board = {
    widthMax: $("#board").width(),
    widthMin: $("#board").width() - $("#board").width(),
    heightMax: $("#board").height(),
    heightMin: $("#board").height() - $("#board").height()
  }


  // controls
  var KEY = {
    space: 32,
    w: 87,
    a: 65,
    s: 83,
    d: 68

  }
  // Player
  var tester = {
    spdX: 0,
    spdY: 0,
    posX: 100,
    posY: 290,
    width: $("#jumper").width(),
    height: $("#jumper").height()
  }

  var tail = {
    spdX: 0,
    spdY: 0,
    posX: 100,
    posY: 290,
    width: $(".tail").width(),
    height: $(".tail").height(),
  }


  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keyup', handleKeyUp);

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
    border()
  }

  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {

    if (event.which === KEY.w) {

      tester.spdY = -10
    }

    if (event.which === KEY.a) {

      tester.spdX = -10
    }

    if (event.which === KEY.d) {

      tester.spdX = 10
    }

    if (event.which === KEY.s) {

      tester.spdY = 10
    }



  }


  function handleKeyUp(event) {

    if (event.which === KEY.w) {
      tester.spdY = 0

    }

    if (event.which === KEY.a) {
      tester.spdX = 0

    }

    if (event.which === KEY.d) {
      tester.spdX = 0

    }

    if (event.which === KEY.s) {
      tester.spdY = 0

    }

  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function moveGameItems() {
    tester.posY += tester.spdY
    tester.posX += tester.spdX

    tail.posX = tester.spdX 
    tail.posY = tester.spdY 

  }


  function border() {


    if (tester.posX < board.widthMin) {
      tester.posX = board.widthMin
    }

    if (tester.posX + tester.width > board.widthMax) {
      tester.posX = board.widthMax - tester.width
    }

    if (tester.posY < board.heightMin) {
      tester.posY = board.heightMin
    }

    if (tester.posY + tester.height > board.heightMax) {
      tester.posY = board.heightMax - tester.height
    }

  }




  function redraw() {
    $("#tester").css('left', tester.posX)
    $("#tester").css('top', tester.posY)

    $(".tail").css('left', tail.posX)
    $(".tail").css('top', tail.posY)

  }




  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

}