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
  var pointL = 0
  var pointR = 0
  var winPoint = 5


  // Game Item Objects
  var ball = {
    spdX: 5,
    spdY: 5,
    posX: 375,
    posY: 180,
    height: $("#ball").height(),
    width: $("#ball").width()
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
    posX: 15,
    height: $("#pad1").height(),
    width: $("#pad1").width()
  }

  //red paddle
  var pad2 = {
    spdY: 0,
    posY: 150,
    posX: 760,
    height: $("#pad2").height(),
    width: $("#pad2").width()
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
    ballborder()
    score()
    doCollide()
    finishpoint()

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

  }

  startBall()
  function startBall() {
    var startX = Math.ceil(Math.random() * 5)
    var startY = Math.ceil(Math.random() * 5)
    

    if(startX < 3){
      ball.spdX = ball.spdX
    } else if (startX > 3){
      ball.spdX = ball.spdX * -1
    }

    if(startY > 3){
      ball.spdY = ball.spdY
    } else if (startY < 3){
      ball.spdY = ball.spdY * -1
    }
  }



  function doCollide() {

    if (collide(pad1, pad2, ball)) {
      console.log(5)
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



  function ballborder(event) {
    // ball Y board 
    if (ball.posY + ball.height >= boardHeightmax) {
      ball.spdY = ball.spdY * -1
    }
    if (ball.posY <= boardHeightmin) {
      ball.spdY = ball.spdY * -1
    }
    // ball X board
    if (ball.posX + ball.width >= boardWidthmax) {
      ball.spdX = ball.spdX * -1

    }
    if (ball.posX <= boardWidthmin) {
      ball.spdX = ball.spdX * -1
    }




  }

  function collide(obj1, obj2, obj3) {

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

  function score() {

    if (ball.posX >= boardWidthmax - 50) {
      pointL = pointL + 1
      ball.posX = 375
      ball.spdY = 5
      $("#pointL").text(pointL)
    }
    if (ball.posX <= boardWidthmin) {
      pointR = pointR + 1
      ball.spdY = 5
      ball.posX = 375
      $("#pointR").text(pointR)
    }

  }



  function redraw() {


    $("#ball").css('left', ball.posX)
    $("#ball").css('top', ball.posY)

    $("#pad1").css('top', pad1.posY)
    $("#pad2").css('top', pad2.posY)
  }
  $("#win").hide()
  function finishpoint(){
    if(pointL === winPoint){
      $("#winner").text("BLUE")
      
      endGame()
      $("#win").show()
    }

    if(pointR === winPoint){
      $("#winner").text("RED")
      
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



