$(document).ready(runProgram);

function runProgram() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  //--------------- Game Variables ---------------//

  var playerItem = $("#player");
  var followerItem = $("#follower");

  var board = {
    widthMax: $("#board").width(),
    widthMin: $("#board").width() - $("#board").width(),
    heightMax: $("#board").height(),
    heightMin: $("#board").height() - $("#board").height(),
  };

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
    l: 76,
  };

  // Player
  var player = {
    maxHP: 100,
    hp: 500,
    armor: 5,
    posX: 100,
    posY: 300,
    spdX: 0,
    spdY: 0,
    width: $("#player").width(),
    height: $("#player").height(),
  };

  // follower
  var follower = {
    posX: 100,
    posY: 300,
    maxSpdX: 10,
    maxSpdY: 10,
    spdX: 0,
    spdY: 0,
    width: $("#follower").width(),
    height: $("#follower").height(),
  };

  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
  $(document).on("keydown", handleKeyDown);
  $(document).on("keyup", handleKeyUp);

  function newFrame() {
    moveGameItems();
    redraw();
    border();
    follow();
  }
  //--------------- Event Handler Functions ---------------//
  function handleKeyDown(event) {
    if (event.which === KEY.w) {
      player.spdY = -10;
    }
    if (event.which === KEY.s) {
      player.spdY = 10;
    }
    if (event.which === KEY.a) {
      player.spdX = -10;
    }
    if (event.which === KEY.d) {
      player.spdX = 10;
    }
  }

  function handleKeyUp(event) {
    if (event.which === KEY.w) {
      player.spdY = 0;
    }
    if (event.which === KEY.s) {
      player.spdY = 0;
    }
    if (event.which === KEY.a) {
      player.spdX = 0;
    }
    if (event.which === KEY.d) {
      player.spdX = 0;
    }
  }

  //--------------- Helper Functions ---------------//

  function moveGameItems() {
    player.posX += player.spdX;
    player.posY += player.spdY;

    follower.posX += follower.spdX;
    follower.posY += follower.spdY;
  }

  function redraw() {
    playerItem.css("left", player.posX);
    playerItem.css("top", player.posY);

    followerItem.css("left", follower.posX);
    followerItem.css("top", follower.posY);
  }

  function border() {
    if (player.posX <= board.widthMin) {
      player.posX = board.widthMin + 10;
    }
    if (player.posX >= board.widthMax - 40) {
      player.posX = board.widthMax - 40;
    }
    if (player.posY <= board.heightMin) {
      player.posY = board.heightMin + 10;
    }
    if (player.posY >= board.heightMax - 40) {
      player.posY = board.heightMax - 40;
    }
  }

  function follow() {
    if (follower.posX > player.posX ) {
      follower.spdX = -follower.maxSpdX;
    }
    if (follower.posX < player.posX) {
      follower.spdX = follower.maxSpdX;
    }
    if (follower.posX === player.posX) {
      follower.spdX = 0;
    }
    if (follower.posY > player.posY) {
      follower.spdY = -follower.maxSpdY;
    }
    if (follower.posY < player.posY ) {
      follower.spdY = follower.maxSpdY;
    }
    if (follower.posY === player.posY) {
      follower.spdY = 0;
    }
  }
}
