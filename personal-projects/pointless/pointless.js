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


  // box
  var box = {
    posX: 675,
    posY: 325,
    spdX: 10,
    spdY: 10,
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
    box.posX += box.spdX
    box.posY += box.spdY


  }

  function redraw() {
    boxItem.css('left', box.posX)
    boxItem.css('top', box.posY)

  }

  function border() {
    if(box.posX + box.width > board.widthMax){
      box.spdX = box.spdX * -1
    }

    if(box.posX < board.widthMin){
      box.spdX = box.spdX * -1
    }

    if(box.posY + box.height > board.widthMax){
      box.spdY = box.spdY * -1
    }

    if(box.posY < board.widthMin){
      box.spdY = box.spdY * -1
    }

  }


}
