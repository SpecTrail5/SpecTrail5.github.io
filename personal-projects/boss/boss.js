$(document).ready(runProgram);

function runProgram() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  // game variables

  var jumperCap = 50
  var bossCap = 2
  var bossRegenCap = 400
  var bossReCap = 400
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


  // controls
  var KEY = {
    space: 32,
    w: 87,
    a: 65,
    s: 83,
    d: 68,
    j: 74,
    k: 75,
    i: 73,
    l: 76

  }
  // Player
  var jumper = {
    maxHp: 200,
    hp: $("#playerHp").width(),
    regen: 2.5,
    spdX: 0,
    spdY: 0,
    posX: 100,
    posY: 480,
    width: $("#jumper").width(),
    height: $("#jumper").height()
  }
  // Attack
  var blast = {
    damge: 40,
    cooldown: 0,
    spdX: jumper.spdX,
    spdY: jumper.spdY,
    posX: 10,
    posY: 390,
    width: $("#blast").width(),
    height: $("#blast").height()
  }

  var block = {
    damge: 1,
    cooldown: 0,
    spdX: jumper.spdX,
    spdY: jumper.spdY,
    posX: 10,
    posY: 390,
    width: $("#block").width(),
    height: $("#block").height()

  }

  var ult = {
    damge: 250,
    cooldown: 1000,
    spdX: jumper.spdX,
    spdY: jumper.spdY,
    posX: 10,
    posY: 390,
    width: $("#ult").width(),
    height: $("#ult").height()
  }

  var heal = {
    regen: 50,
    cooldown: 550,
    spdX: jumper.spdX,
    spdY: jumper.spdY,
    posX: 10,
    posY: 390,
    width: $("#heal").width(),
    height: $("#heal").height()
  }

  // boss
  var boss = {
    maxHp: 1600,
    hp: 1600,
    regen: 25,
    attack: 5,
    tpCD: 1000,
    spdX: -5,
    spdY: -5,
    posX: 900,
    posY: 360,
    width: $("#boss").width(),
    height: $("#boss").height()
  }



  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keyup', handleKeyUp);

  $("#blast").hide()
  $("#block").hide()
  $("#heal").hide()
  $("#ult").hide()

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
    bossRegen()
    bosslvl()
    dieWin()
    cooldowns()
    playerRegen()
  }

  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {

    if (event.which === KEY.w) {
      boostUp = 1
      jumper.spdY = -10
    }

    if (event.which === KEY.a) {
      boostLeft = 1
      jumper.spdX = -10
    }

    if (event.which === KEY.d) {
      boostRight = 1
      jumper.spdX = 10
    }

    if (event.which === KEY.s) {
      boostDown = 1
      jumper.spdY = 10
    }

    if (event.which === KEY.space && boostUp === 1) {
      jumper.spdY = -25
    }

    if (event.which === KEY.space && boostLeft === 1) {
      jumper.spdX = -25
    }

    if (event.which === KEY.space && boostRight === 1) {
      jumper.spdX = 25
    }

    if (event.which === KEY.space && boostDown === 1) {
      jumper.spdY = 25
    }

    if (event.which === KEY.j && blast.cooldown === 0) {
      blast.cooldown = 200
      $("#blast").show()
      attackcollide(blast, boss)
    }

    if (event.which === KEY.k && block.cooldown === 0) {
      block.cooldown = 50
      $("#block").show()
      blockCollide(block, boss)
    }

    if (event.which === KEY.i && heal.cooldown === 0) {
      heal.cooldown = 550
      $("#heal").show()
      healing()
    }

    if (event.which === KEY.l && ult.cooldown === 0) {
      ult.cooldown = 1000
      $("#ult").show()
      attackcollide(ult, boss)
    }

  }


  function handleKeyUp(event) {

    if (event.which === KEY.w) {
      jumper.spdY = 0
      boostUp = 0
    }

    if (event.which === KEY.a) {
      jumper.spdX = 0
      boostLeft = 0
    }

    if (event.which === KEY.d) {
      jumper.spdX = 0
      boostRight = 0
    }

    if (event.which === KEY.s) {
      jumper.spdY = 0
      boostDown = 0
    }

    if (event.which === KEY.j) {
      $("#blast").hide()
    }

    if (event.which === KEY.k) {
      $("#block").hide()
    }

    if (event.which === KEY.i) {
      $("#heal").hide()
    }

    if (event.which === KEY.l) {
      $("#ult").hide()
    }

  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function moveGameItems() {
    jumper.posY += jumper.spdY
    jumper.posX += jumper.spdX

    blast.posX = jumper.posX - 140
    blast.posY = jumper.posY - 140

    block.posX = jumper.posX - 90
    block.posY = jumper.posY - 90

    heal.posX = jumper.posX - 65
    heal.posY = jumper.posY - 65

    ult.posX = jumper.posX - 40
    ult.posY = jumper.posY - 40

    boss.posX += boss.spdX
    boss.posY += boss.spdY

  }


  function border() {

    if (boss.posY < board.heightMin) {
      var TY = Math.ceil( Math.random() * 5)
      if(TY !== 3){
      boss.spdY = boss.spdY * -1
      }
      else{
        boss.posY = board.heightMax - boss.height
      }
    }

    if (boss.posY + boss.height > board.heightMax) {
     var BY = Math.ceil( Math.random() * 5)
      if(BY !== 3){
      boss.spdY = boss.spdY * -1
      }
      else {
        boss.posY = board.heightMin
      }
    }

    if (boss.posX < board.widthMin) {
     var LX = Math.ceil( Math.random() * 5)
      if(LX !== 3){
      boss.spdX = boss.spdX * -1
      }
      else {
        boss.posX = board.widthMax - boss.width
      }
    }

    if (boss.posX + boss.width >= board.widthMax) {
     var RX = Math.ceil( Math.random() * 5)
      if(RX !== 3){
      boss.spdX = boss.spdX * -1
      }
      else {
        boss.posX = board.widthMin
      }
    }

    if (jumper.posX < board.widthMin) {
      jumper.posX = board.widthMin
    }

    if (jumper.posX + jumper.width > board.widthMax) {
      jumper.posX = board.widthMax - jumper.width
    }

    if (jumper.posY < board.heightMin) {
      jumper.posY = board.heightMin
    }

    if (jumper.posY + jumper.height > board.heightMax) {
      jumper.posY = board.heightMax - jumper.height
    }

  }

  function bosscollide(obj1, obj2,) {

    obj1.left = jumper.posX
    obj1.right = jumper.posX + jumper.width
    obj1.top = jumper.posY
    obj1.buttom = jumper.posY + jumper.height

    obj2.left = boss.posX
    obj2.right = boss.posX + boss.width
    obj2.top = boss.posY
    obj2.buttom = boss.posY + boss.height

    if (obj1.buttom > obj2.top && obj1.top < obj2.buttom && obj1.left < obj2.right && obj1.right > obj2.left) {
      jumper.hp = jumper.hp - boss.attack
      $("#playerHp").text("HP:" + jumper.hp)
      $("#playerHp").css('width', jumper.hp)
    }

  }

  function bosslvl() {
    boss.tpCD = boss.tpCD - 1
    if(boss.hp < 600 && boss.tpCD <= 0){
      boss.tpCD = 1000
      boss.posY = Math.random() * board.heightMax
      boss.posX =  Math.random() * board.widthMax
    }

    if (boss.hp < 400) {
      boss.attack = 10
    } else if (boss.hp < 100) {
      boss.attack = 15
    }

    if (boss.hp <= 1000 && bossCap === 2) {
      bossCap = bossCap - 1
      boss.spdX = boss.spdX * 2
      boss.spdY = boss.spdY * 2
    }

    if (boss.hp <= 250 && bossCap === 1) {
      bossCap = bossCap - 1
      boss.spdX = boss.spdX * 1.5
      boss.spdY = boss.spdY * 1.5
    }
    if (boss.hp <= 175) {
      bossReCap = bossReCap - 1
      if (boss.hp < 50 && bossReCap <= 0) {
        bossReCap = 400
        boss.hp = boss.hp + 500
        $("#bossHp").text((Math.ceil(boss.hp) - 1))
      }
    }

  }

  function bossRegen() {
    bossRegenCap = bossRegenCap - 1
    if (boss.hp < boss.maxHp && bossRegenCap === 0) {
      bossRegenCap = 400
      boss.hp = boss.hp + boss.regen
      $("#bossHp").text((Math.ceil(boss.hp) - 1))
    }


  }

  function playerRegen() {
    jumperCap = jumperCap - 2
    if (jumper.hp < jumper.maxHp && jumperCap <= 0) {
      jumperCap = jumper.hp
      jumper.hp = jumper.hp + jumper.regen
      $("#playerHp").text("HP:" + (Math.ceil(jumper.hp) - 1))
    }
  }

  function attackcollide(obj1, obj2,) {

    obj1.left = obj1.posX
    obj1.right = obj1.posX + obj1.width
    obj1.top = obj1.posY
    obj1.buttom = obj1.posY + obj1.height

    obj2.left = boss.posX
    obj2.right = boss.posX + boss.width
    obj2.top = boss.posY
    obj2.buttom = boss.posY + boss.height

    if (obj1.buttom > obj2.top && obj1.top < obj2.buttom && obj1.left < obj2.right && obj1.right > obj2.left) {
      boss.hp = boss.hp - obj1.damge
      $("#boss").text(boss.hp)
    }
  }

  function healing() {

    jumper.hp = jumper.hp + heal.regen
    if (jumper.hp > jumper.maxHp) {
      jumper.hp = jumper.maxHp
    }
      $("#playerHp").text("HP:" + (Math.ceil(jumper.hp) - 1))
      $("#playerHp").css('width', jumper.hp)

  }

  function blockCollide(obj1, obj2,) {

    obj1.left = obj1.posX
    obj1.right = obj1.posX + obj1.width
    obj1.top = obj1.posY
    obj1.buttom = obj1.posY + obj1.height

    obj2.left = boss.posX
    obj2.right = boss.posX + boss.width
    obj2.top = boss.posY
    obj2.buttom = boss.posY + boss.height

    if (obj1.buttom > obj2.top && obj1.top < obj2.buttom && obj1.left < obj2.right && obj1.right > obj2.left) {
      boss.spdY = boss.spdY * -1
      boss.spdX = boss.spdX * -1
      boss.hp = boss.hp - obj1.damge
      $("#boss").text(boss.hp)

    }

  }

  function cooldowns() {
    blast.cooldown = blast.cooldown - 1
    $("#bcd").text("blast:" + (blast.cooldown + 1))

    if (blast.cooldown <= 1) {
      blast.cooldown = 0
    }
    if (jumper.hp <= 30) {
      blast.cooldown = 0
      $("#bcd").text("blast:" + (blast.cooldown))
    }

    //---------------------------------------------------//
    block.cooldown = block.cooldown - 1
    $("#dcd").text("block:" + (block.cooldown + 1))

    if (block.cooldown <= 1) {
      block.cooldown = 0
    }
    if (jumper.hp <= 40) {
      block.cooldown = 0
      $("#dcd").text("block:" + (block.cooldown))
    }

    //---------------------------------------------------//
    heal.cooldown = heal.cooldown - 1
    $("#Hcd").text("heal:" + (heal.cooldown + 1))

    if (heal.cooldown <= 1) {
      heal.cooldown = 0
    }

    //---------------------------------------------------//
    ult.cooldown = ult.cooldown - 1
    $("#ucd").text("ult:" + (ult.cooldown + 1))

    if (ult.cooldown <= 1) {
      ult.cooldown = 0
    }

    if (jumper.hp <= 20) {
      ult.cooldown = 100
      $("#ucd").text("ult:" + (ult.cooldown))
    }

  }


  function redraw() {
    $("#boss").text(boss.hp)
    $("#playerHp").text("HP:" + Math.ceil(jumper.hp))
    $("#playerHp").css('width', jumper.hp)

    $("#jumper").css('left', jumper.posX)
    $("#jumper").css('top', jumper.posY)

    $("#blast").css('left', blast.posX)
    $("#blast").css('top', blast.posY)

    $("#block").css('left', block.posX)
    $("#block").css('top', block.posY)

    $("#heal").css('left', heal.posX)
    $("#heal").css('top', heal.posY)

    $("#ult").css('left', ult.posX)
    $("#ult").css('top', ult.posY)

    $("#boss").css('left', boss.posX)
    $("#boss").css('top', boss.posY)
  }

  function dieWin() {
    $("#shade").hide()

    if (jumper.hp <= 0) {
      $("#dieWin").text("You Died")
      $("#shade").show()
      endGame()
    }

    if (boss.hp <= 0) {
      $("#dieWin").text("You Win")
      $("#dieWin").css("color", 'aqua')
      $("#shade").show()
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