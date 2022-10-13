$(document).ready(runProgram)

function runProgram(){
    const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  var KEY = {
    space: 32
  }

  var num = [5]

  var num_of_num = document.getElementById("num-of-num").value;

  var between_num = {
    num1: document.getElementById("between-num1").value,
    num2: document.getElementById("between-num2").value
  }
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
  $(document).on('keyup',handleKeyUp)

  function newFrame(){
    num_of_num = document.getElementById("num-of-num").value
   
  }

  function handleKeyUp(event){
    if (event.which === KEY.space){
         $("#num").text(num_of_num)
    }
  }


}