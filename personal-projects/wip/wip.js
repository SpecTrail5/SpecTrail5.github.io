$(document).ready(runProgram);

function runProgram(){
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
    // game variables
  

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
  
    }

    var jumper = {
        spdX: 0,
        spdY: 0,
        posX: 10,
        posY: 530,
        width: $("#jumper").width(),
        height: $("#jumper").height()
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
  
      if (event.which === KEY.up) {
        jumper.spdY = -5
      }
  
      if (event.which === KEY.left) {
        jumper.spdX = -5
      }
      if (event.which === KEY.right) {
        jumper.spdX = 5
      }
  
  
    } 
  
  
    function handleKeyUp(event) {
  
        if (event.which === KEY.up) {
            jumper.spdY = 0
          }
      
          if (event.which === KEY.left) {
            jumper.spdX = 0
          }
          if (event.which === KEY.right) {
            jumper.spdX = 0
          }
    }
  
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
  
    function moveGameItems() {
        jumper.posX += jumper.spdX
        
  
    }
  
  
    function border() {
  
    }

  
    function redraw() {
  
    }

  
    function endGame() {
      // stop the interval timer
      clearInterval(interval);
  
      // turn off event handlers
      $(document).off();
    }

}