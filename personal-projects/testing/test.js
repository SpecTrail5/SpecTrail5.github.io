$(document).ready(runProgram);

function runProgram() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  // game variables



  var coins = {
    count: 0,
    gain: 99999
  }

  var pu1 = {
    price: 25,
    lvl: 0
  }
  var rate = 100
  var pu2 = {
    price: 100,
    lvl: 0,
    trig: 0,
    gain: 1,
  }


  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);

  $("#coin").on('click', function click() {
    coins.count = coins.count + coins.gain
  })

  $("#pu1").on('click', pu1Click);
  $("#pu2").on('click', pu2Click);

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  function newFrame() {
    redraw();
    generator()
  }

  function pu1Click() {
    if (coins.count >= pu1.price) {
      coins.count = coins.count - pu1.price
      coins.gain = coins.gain + 1
      pu1.lvl = pu1.lvl + 1
      pu1.price = Math.ceil(pu1.price * 1.5)
      $("#1Lvl").text("lvl:" + pu1.lvl)
      $("#1Price").text("price:" + pu1.price)
    }
  }

  function pu2Click() {
    if (coins.count >= pu2.price) {
      coins.count = coins.count - pu2.price
      pu2.trig = pu2.trig + 1
      pu2.lvl = pu2.lvl + 1
      pu2.price = Math.ceil( pu2.price + (pu2.price / 2))
      $("#2Lvl").text("lvl:" + pu2.lvl)
      $("#2Price").text("price:" + pu2.price)
    }
  }



  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

function generator(){
  rate = rate - 1
  if(rate <= 0 && pu2.lvl > 0){
  coins.count = coins.count + pu2.gain
  rate = 100
  if(pu2.lvl > pu2.gain){
    pu2.gain = pu2.gain + 1
  }
  if(pu2.lvl >= 5){
    rate = 75
  }
  else if(pu2.lvl >= 15){
    rate = 50
  }
  else if (pu2.lvl === 25){
    rate = 25
  }
  else if (pu2.lvl === 50){
    rate = 5
  }

  }
}





  function redraw() {
    $("#coins").text("coins:" + coins.count)

  }


}