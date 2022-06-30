$(document).ready(runProgram);

function runProgram() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  // game variables

  
  
  var boostUp = 0
  var boostDown = 0
  var boostLeft = 0
  var boostRight = 0

  

  var board = {
    widthMax: $("#board").width(),
    widthMin: $("#board").width() - $("#board").width(),
    heightMax: $("#board").height(),
    heightMin: $("#board").height() - $("#board").height()
  }



  var KEY = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    space: 32,
    w: 87,
    a: 65,
    s: 83,
    d: 68

  }

  var jumper = {
    hp: 50,
    spdX: 0,
    spdY: 0,
    posX: 10,
    posY: 390,
    width: $("#jumper").width(),
    height: $("#jumper").height()
  }

  var boss = {
    hp: 500,
    spdX: -10,
    spdY: -10,
    posX: 900,
    posY: 360,
    width: $("#boss").width(),
    height: $("#boss").height()
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
    bosscollide(jumper, boss)
    die()
  }

  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {

    if (event.which === (KEY.up || KEY.w)) {
      boostUp = 1
      jumper.spdY = -10
      
    }
    if (event.which === KEY.left) {
      boostLeft = 1
      jumper.spdX = -10
      
    }
    if (event.which === KEY.right) {
      boostRight = 1
      jumper.spdX = 10
    }
    if (event.which === KEY.down) {
      boostDown = 1
      jumper.spdY = 10
    }

    if(event.which === KEY.space && boostUp === 1){
      jumper.spdY = -25

    }
    if(event.which === KEY.space && boostLeft === 1){
      jumper.spdX = -25
    }
    if(event.which === KEY.space && boostRight === 1){
      jumper.spdX = 25
    }
    if(event.which === KEY.space && boostDown === 1){
      jumper.spdY = 25
    }
    


  }


  function handleKeyUp(event) {

    if (event.which === KEY.up) {
      jumper.spdY = 0
      boostUp = 0
    }

    if (event.which === KEY.left) {
      jumper.spdX = 0
      boostLeft = 0
    }
    if (event.which === KEY.right) {
      jumper.spdX = 0
      boostRight = 0
    }
    if (event.which === KEY.down) {
      jumper.spdY = 0
      boostDown = 0
    }

  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function moveGameItems() {
    jumper.posY += jumper.spdY
    jumper.posX += jumper.spdX

    boss.posX += boss.spdX
    boss.posY += boss.spdY

  }


  function border() {

    if (boss.posY < board.heightMin) {
      boss.spdY = boss.spdY * -1
    }
    if (boss.posY > board.heightMax) {
      boss.spdY = boss.spdY * -1
    }
    if (boss.posX < board.widthMin) {
      boss.spdX = boss.spdX * -1
    }
    if (boss.posX > board.widthMax) {
      boss.spdX = boss.spdX * -1
    }

    if (jumper.posX < board.widthMin) {
      jumper.posX = board.widthMin
    }
    if (jumper.posX > board.widthMax) {
      jumper.posX = board.widthMax
    }
    if (jumper.posY < board.heightMin) {
      jumper.posY = board.heightMin
    }
    if (jumper.posY > board.heightMax) {
      jumper.posY = board.heightMax
    }


  }

  function bosscollide(obj1, obj2) {

    obj1.left = jumper.posX
    obj1.right = jumper.posX + jumper.width
    obj1.top = jumper.posY
    obj1.buttom = jumper.posY + jumper.height

    obj2.left = boss.posX
    obj2.right = boss.posX + boss.width
    obj2.top = boss.posY
    obj2.buttom = boss.posY + boss.height

    if (obj1.buttom > obj2.top && obj1.top < obj2.buttom && obj1.left < obj2.right && obj1.right > obj2.left) {
      jumper.hp = jumper.hp - 1
      $("#playerHp").text("HP:" + jumper.hp)
    }

  }


  function redraw() {
    $("#jumper").css('left', jumper.posX)
    $("#jumper").css('top', jumper.posY)
    $("#boss").css('left', boss.posX)
    $("#boss").css('top', boss.posY)
  }

  function die(){
$("#die").hide()
    if(jumper.hp === 0){
      $("#die").show()
      endGame()
    }
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

}