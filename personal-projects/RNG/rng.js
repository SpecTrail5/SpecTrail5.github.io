$(document).ready(runProgram)

function runProgram(){
    const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  var KEY = {
    space: 32
  }

  var num = []

  var num_of_num = document.getElementById("num-of-num").value;

  var between = {
    num1: document.getElementById("between-num1").value,
    num2: document.getElementById("between-num2").value
  }
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
  $(document).on('keyup',handleKeyUp)

  function newFrame(){
    num_of_num = document.getElementById("num-of-num").value

    between.num1 = document.getElementById("between-num1").value
    between.num2 = document.getElementById("between-num2").value

    $("#num").text(num)

  }

  function handleKeyUp(event){
    if (event.which === KEY.space){
         generateNum()
    }
  }

  function keepInBounds(bound){
   return Math.max(between.num1,Math.min(between.num2,bound))
  }

  function generateNum(){
    for(var i = 0; i < num_of_num;i++){
      
    }
    
  }

}