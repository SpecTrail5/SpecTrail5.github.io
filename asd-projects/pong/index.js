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

  var pointL = 0
  var pointR = 0
  var winPoint = 10
  // board walls
  var board = {
    widthMax: $("#board").width(),
    widthMin: 0 ,
    heightMax: $("#board").height(),
    heightMin: 0
  }


  // Game Item Objects
  var ball = {
    spdX: 0,
    spdY: 0,
    posX: 450,
    posY: 180,
    height: $("#ball").height(),
    width: $("#ball").width()
  }

  var KEY = {
    //blue paddle control
    w: 87,
    s: 83,
    //red paddle control
    up: 38,
    down: 40,
    // left booster controls
    a: 65,
    d: 68,
    // right booster controls
    left: 37,
    right: 39,

  }
  //blue paddle
  var pad1 = {
    spdY: 0,
    posY: 150,
    posX: 15,
    height: $("#pad1").height(),
    width: $("#pad1").width()
  }
  //left booster
  var boostL = {
    spdY: 0,
    posY: 200,
    posX: 205,
    height: $("#boost1").height(),
    width: $("#boost1").width()

  }

  //red paddle
  var pad2 = {
    spdY: 0,
    posY: 150,
    posX: 960,
    height: $("#pad2").height(),
    width: $("#pad2").width()
  }
  //right booster
  var boostR = {
    spdY: 0,
    posY: 200,
    posX: 750,
    height: $("#boost2").height(),
    width: $("#boost2").width()

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
    score()
    doCollide()
    finishpoint()
    boostCollide()
    padBorder()
    
  }

  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {

    if (event.which === KEY.w) {
      pad1.spdY = -10

    }
    if (event.which === KEY.s) {
      pad1.spdY = 10

    }

    if (event.which === KEY.up) {
      pad2.spdY = -10
    }
    if (event.which === KEY.down) {
      pad2.spdY = 10
    }

    if (event.which === KEY.a) {
      boostL.spdY = -5
    }
    if (event.which === KEY.d) {
      boostL.spdY = 5
    }

    if (event.which === KEY.left) {
      boostR.spdY = -5
    }
    if (event.which === KEY.right) {
      boostR.spdY = 5
    }


  }


  startBall()


  startBall()
  function startBall() {
    var startX = Math.ceil(Math.random() * 5)
    var startY = Math.ceil(Math.random() * 5)


    if (startX < 3) {
      ball.spdX = -5
    } else if (startX > 3) {
      ball.spdX = 5
    }

    if (startY > 3) {
      ball.spdY = -5
    } else if (startY < 3) {
      ball.spdY = 5
    }
  }


  // calls collide functions
  function doCollide() {

    if (padCollide(pad1, pad2, ball)) {
      console.log("coconut")
    }

  }

  function boostCollide() {

    if (booster(boostL, boostR, ball)) {
      console.log("Gala")
    }

  }



  function handleKeyUp(event) {

    if (event.which === KEY.w) {
      pad1.spdY = 0

    }
    if (event.which === KEY.s) {
      pad1.spdY = 0
    }

    if (event.which === KEY.up) {
      pad2.spdY = 0
    }
    if (event.which === KEY.down) {
      pad2.spdY = 0
    }

    if (event.which === KEY.a) {
      boostL.spdY = 0
    }
    if (event.which === KEY.d) {
      boostL.spdY = 0
    }

    if (event.which === KEY.left) {
      boostR.spdY = 0
    }
    if (event.which === KEY.right) {
      boostR.spdY = 0
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

    boostL.posY += boostL.spdY
    boostR.posY += boostR.spdY

  }



  function border() {
    // ball Y border collision
    if (ball.posY + ball.height >= board.heightMax) {
      ball.spdY = ball.spdY * -1
    }
    if (ball.posY <= board.heightMin) {
      ball.spdY = ball.spdY * -1
    }
    // ball X border collision
    if (ball.posX + ball.width >= board.widthMax) {
      ball.spdX = ball.spdX * -1

    }
    if (ball.posX <= board.widthMin) {
      ball.spdX = ball.spdX * -1
    }
    // left booster border collision
    if (boostL.posY <= board.heightMin) {
      boostL.posY = board.heightMin
    }
    if (boostL.posY + boostL.height >= board.heightMax) {
      boostL.posY = board.heightMax - boostL.height
    }
    // right booster border collision
    if (boostR.posY <= board.heightMin) {
      boostR.posY = board.heightMin
    }
    if (boostR.posY + boostR.height >= board.heightMax) {
      boostR.posY = board.heightMax - boostR.height
    }
    // left paddle border collision
    if (pad1.posY < board.heightMin) {
      pad1.posY = board.heightMin
    }
    if (pad1.posY + pad1.height > board.heightMax) {
      pad1.posY = board.heightMax - pad1.height
    }
    // right paddle border collision
    if (pad2.posY < board.heightMin) {
      pad2.posY = board.heightMin
    }
    if (pad2.posY + pad2.height > board.heightMax) {
      pad2.posY = board.heightMax - pad2.height
    }

  }

  // handles paddles collisions with ball
  function padCollide(obj1, obj2, obj3) {

    obj1.left = pad1.posX
    obj1.right = pad1.posX + pad1.width
    obj1.top = pad1.posY
    obj1.buttom = pad1.posY + pad1.height

    obj2.left = pad2.posX
    obj2.right = pad2.posX + pad2.width
    obj2.top = pad2.posY
    obj2.buttom = pad2.posY + pad2.height

    obj3.left = ball.posX
    obj3.right = ball.posX + ball.width
    obj3.top = ball.posY
    obj3.buttom = ball.posY + ball.height

    if (obj3.left < obj1.right && obj3.top < obj1.buttom && obj3.buttom > obj1.top) {
      ball.spdX = ball.spdX * -1
      ball.spdY = ball.spdY + pad1.spdY
    }

    if (obj3.right > obj2.left && obj3.top < obj2.buttom && obj3.buttom > obj2.top) {
      ball.spdX = ball.spdX * -1
      ball.spdY = ball.spdY + pad2.spdY
    }

  }
  // handles boosters collisions with ball
  function booster(obj1, obj2, obj3) {

    obj1.left = boostL.posX
    obj1.right = boostL.posX + boostL.width
    obj1.top = boostL.posY
    obj1.buttom = boostL.posY + boostL.height

    obj2.left = boostR.posX
    obj2.right = boostR.posX + boostR.width
    obj2.top = boostR.posY
    obj2.buttom = boostR.posY + boostR.height

    obj3.left = ball.posX
    obj3.right = ball.posX + ball.width
    obj3.top = ball.posY
    obj3.buttom = ball.posY + ball.height

    if (obj3.left < obj1.right && obj3.top < obj1.buttom && obj3.buttom > obj1.top && obj3.right > obj1.left) {
      ball.spdY = 0
      ball.spdX = 20
    }

    if (obj3.right > obj2.left && obj3.top < obj2.buttom && obj3.buttom > obj2.top && obj3.left < obj2.right) {
      ball.spdY = 0
      ball.spdX = -20

    }

  }
  // handles scoring
  function score() {

    if (ball.posX >= board.widthMax - ball.width) {
      pointL = pointL + 1
      ball.posX = 375
      ball.posY = 180
      ball.spdY = 5
      ball.spdX = 5
      $("#pointL").text(pointL)
    }
    if (ball.posX <= board.widthMin) {
      pointR = pointR + 1
      ball.spdY = 5
      ball.posY = 180
      ball.posX = 375
      ball.spdX = 5
      $("#pointR").text(pointR)
    }

  }



  function redraw() {

    $("#ball").css('left', ball.posX)
    $("#ball").css('top', ball.posY)

    $("#pad1").css('top', pad1.posY)
    $("#pad2").css('top', pad2.posY)

    $("#boost1").css('top', boostL.posY)
    $("#boost2").css('top', boostR.posY)
  }

  // handles win
  $("#win").hide()
  function finishpoint() {
    if (pointL === winPoint) {
      $("#winner").text("BLUE")
      $("#winner").css('color', 'rgb(0, 0, 255)')
      endGame()
      $("#win").show()
    }

    if (pointR === winPoint) {
      $("#winner").text("RED")
      $("#winner").css('color', 'rgb(255, 0, 0)')
      endGame()
      $("#win").show()
    }
  }




  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

}



