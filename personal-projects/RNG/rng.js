$(document).ready(runProgram)

function runProgram(){
    const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  var KEY = {
    space: 32
  }

  var num = [5]

  var num_of_num = $('#num-number').text()

  var between_num1 = $('#between-num1')
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);

  function newFrame(){
    $("#num").text(num)
  }


}