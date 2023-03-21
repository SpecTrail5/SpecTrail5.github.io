$(document).ready(runProgram);

function runProgram() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  //--------------- Game Variables ---------------//
    var boxItem = $("#box")

  var board = {
    widthMax: $("#board").width(),
    widthMin: $("#board").width() - $("#board").width(),
    heightMax: $("#board").height(),
    heightMin: $("#board").height() - $("#board").height(),
  };


  // Player
  var box = {
    posX: 675,
    posY: 325,
    spdX: 0,
    spdY: 0,
    width: $("#box").width(),
    height: $("#box").height(),
  };



  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);

  function newFrame() {
    moveGameItems();
    redraw();
    border();

  }


  //--------------- Helper Functions ---------------//

  function moveGameItems() {
    
  }

  function redraw() {
    boxItem.css('left', box.posX)
    
  }

  function border() {
    
  }

  
}
