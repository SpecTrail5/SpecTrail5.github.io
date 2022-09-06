


// controls
var KEY = {
  space: 32,
  w: 87,
  a: 65,
  s: 83,
  d: 68,
  j: 74,
  k: 75,
  i: 73,
  l: 76

}

var board = {
  widthMax: $("#board").width(),
  widthMin: $("#board").width() - $("#board").width(),
  heightMax: $("#board").height(),
  heightMin: $("#board").height() - $("#board").height()
}

var player = {
  hp: 500,
  posX: 100,
  posY: 100,
  spdX: 0,
  spdY: 0,
  width: $("#player").width(),
  height: $("#player").height()
}

$(document).ready(runProgram);

function runProgram() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;



  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keyup', handleKeyUp);



  ///////////////////////// CORE LOGIC ///////////////////////////////////////////



  function newFrame() {
    moveGameItems()
    redraw();
    border()
  }


  function handleKeyDown(event) {
    if (event.which === KEY.w) {
      player.spdY = -10
    }
    if (event.which === KEY.s) {
      player.spdY = 10
    }
    if (event.which === KEY.a) {
      player.spdX = -10
    }
    if (event.which === KEY.d) {
      player.spdX = 10
    }

  }


  function handleKeyUp(event) {
    if (event.which === KEY.w) {
      player.spdY = 0
    }
    if (event.which === KEY.s) {
      player.spdY = 0
    }
    if (event.which === KEY.a) {
      player.spdX = 0
    }
    if (event.which === KEY.d) {
      player.spdX = 0
    }

  }

  ///////////////// HELPER FUNCTIONS ///////////////////


  function moveGameItems() {
    player.posX += player.spdX
    player.posY += player.spdY

  }



  function redraw() {
    $("#player").css('left', player.posX)
    $("#player").css('top', player.posY)

  }

  function border() {
    if (player.posX >= board.widthMax) {
      player.posX = board.widthMax
    }
  }


  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
}