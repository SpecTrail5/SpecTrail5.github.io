$(document).ready(runProgram);

function runProgram() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  //--------------- Game Variables ---------------//

  var playerItem = $("#player");
  var BOSSitem = $("#BOSS");


  var board = {
    widthMax: $("#board").width(),
    widthMin: $("#board").width() - $("#board").width(),
    heightMax: $("#board").height(),
    heightMin: $("#board").height() - $("#board").height(),
  };

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
    l: 76,
  };

  // Player
  var player = {
    maxHP: 500,
    hp: 500,
    maxShield: 250,
    shield: 250,
    armor: 5,
    posX: 100,
    posY: 300,
    spdX: 0,
    spdY: 0,
    width: $("#player").width(),
    height: $("#player").height(),
  };


  // BOSS
  var BOSS = {
    maxHP: 1000,
    hp: 10000,
    damage: 10,
    classdur: 500,
    class: 0,
    posX: 1000,
    posY: 300,
    maxSpdX: 5,
    maxSpdY: 5,
    spdX: 0,
    spdY: 0,
    width: $("#BOSS").width(),
    height: $("#BOSS").height(),
  };

  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
  $(document).on("keydown", handleKeyDown);
  $(document).on("keyup", handleKeyUp);

  function newFrame() {
    moveGameItems();
    redraw();
    border();
    follow();
    colloide(BOSS, player);
    bossClass();
    playerUnitys()
    playerFx()
    dieWin()



  }
  //--------------- Event Handler Functions ---------------//
  function handleKeyDown(event) {
    if (event.which === KEY.w) {
      player.spdY = -15;
    }
    if (event.which === KEY.s) {
      player.spdY = 15;
    }
    if (event.which === KEY.a) {
      player.spdX = -15;
    }
    if (event.which === KEY.d) {
      player.spdX = 15;
    }
    if (event.which === KEY.space) {
      dash()
    }

  }

  function handleKeyUp(event) {
    if (event.which === KEY.w) {
      player.spdY = 0;
    }
    if (event.which === KEY.s) {
      player.spdY = 0;
    }
    if (event.which === KEY.a) {
      player.spdX = 0;
    }
    if (event.which === KEY.d) {
      player.spdX = 0;
    }
  }

  //--------------- Helper Functions ---------------//

  function moveGameItems() {
    player.posX += player.spdX;
    player.posY += player.spdY;

    BOSS.posX += BOSS.spdX;
    BOSS.posY += BOSS.spdY;

  }

  function redraw() {
    playerItem.css("left", player.posX);
    playerItem.css("top", player.posY);

    BOSSitem.css("left", BOSS.posX);
    BOSSitem.css("top", BOSS.posY);

    $("#HP").css("width", player.hp);
    $("#shield").css("width", player.shield);
  }

  function border() {
    if (player.posX <= board.widthMin) {
      player.posX = board.widthMin + 10;
    }
    if (player.posX >= board.widthMax - 40) {
      player.posX = board.widthMax - 40;
    }
    if (player.posY <= board.heightMin) {
      player.posY = board.heightMin + 10;
    }
    if (player.posY >= board.heightMax - 40) {
      player.posY = board.heightMax - 40;
    }

    if (BOSS.posX <= board.widthMin) {
      BOSS.posX = board.widthMin;
    }
    if (BOSS.posX >= board.widthMax - BOSS.width - 5) {
      BOSS.posX = board.widthMax - BOSS.width - 5;
    }
    if (BOSS.posY <= board.heightMin) {
      BOSS.posY = board.heightMin;
    }
    if (BOSS.posY >= board.heightMax - BOSS.height - 5) {
      BOSS.posY = board.heightMax - BOSS.height - 5;
    }
  }

  function follow() {
    if (BOSS.class !== 1) {
      if (BOSS.posX > player.posX + player.width) {
        BOSS.spdX = -BOSS.maxSpdX;
      }
      if (BOSS.posX < player.posX - BOSS.width) {
        BOSS.spdX = BOSS.maxSpdX;
      }
      if (BOSS.posX === player.posX - 40) {
        BOSS.spdX = 0;
      }
      if (BOSS.posY > player.posY + player.height) {
        BOSS.spdY = -BOSS.maxSpdY;
      }
      if (BOSS.posY < player.posY - BOSS.height) {
        BOSS.spdY = BOSS.maxSpdY;
      }
      if (BOSS.posY === player.posY - 40) {
        BOSS.spdY = 0;
      }
    }
    if (BOSS.class === 1) {

      if (BOSS.spdX === 0) {
        BOSS.spdX = 10 || -10
      }

      if (BOSS.posX <= board.widthMin) {
        BOSS.spdX = BOSS.maxSpdX
      }
      if (BOSS.posX >= board.widthMax - BOSS.width - 5) {
        BOSS.spdX = -BOSS.maxSpdX
      }

      if (BOSS.spdY === 0) {
        BOSS.spdY = 10 || -10
      }
      if (BOSS.posY <= board.heightMin) {
        BOSS.spdY = BOSS.maxSpdY
      }
      if (BOSS.posY >= board.heightMax - BOSS.height - 5) {
        BOSS.spdY = -BOSS.maxSpdY
      }

    }

  }

  function colloide(obj1, obj2) {
    obj1.left = obj1.posX;
    obj1.right = obj1.posX + obj1.width;
    obj1.top = obj1.posY;
    obj1.bottom = obj1.posY + obj1.height;

    obj2.left = obj2.posX;
    obj2.right = obj2.posX + obj2.width;
    obj2.top = obj2.posY;
    obj2.bottom = obj2.posY + obj2.height;

    if (
      obj1.left < obj2.right &&
      obj1.right > obj2.left &&
      obj1.top < obj2.bottom &&
      obj1.bottom > obj2.top
    ) {
      player.shield = player.shield - BOSS.damage;
    }

    if (
      obj1.left < obj2.right &&
      obj1.right > obj2.left &&
      obj1.top < obj2.bottom &&
      obj1.bottom > obj2.top && player.shield <= 0
    ) {
      player.hp = player.hp - BOSS.damage / player.armor;
    }
  }

  function bossClass() {
    BOSS.classdur = BOSS.classdur - 1;
    if (BOSS.classdur <= 0) {
      BOSS.class = Math.ceil(Math.random() * 4);
      if (BOSS.class === 1) {
        BOSS.classdur = 500
      } else if (BOSS.class === 4) {
        BOSS.classdur = 250
      } else { BOSS.classdur = 1000 }

    }

    if (BOSS.class === 0) {
      BOSSitem.css(
        "box-shadow",
        "0px 0px 20px darkblue, 0px 0px 20px darkblue inset"
      );
      BOSSitem.css("border-color", "darkblue");
      BOSSitem.css("width", 100);
      BOSSitem.css("height", 100);
      BOSS.width = 100
      BOSS.height = 100
      BOSS.maxSpdX = 5;
      BOSS.maxSpdY = 5;
      BOSS.damage = 10;
    }

    if (BOSS.class === 1) {
      BOSSitem.css(
        "box-shadow",
        "0px 0px 20px darkred, 0px 0px 20px darkred inset"
      );
      BOSSitem.css("border-color", "darkred");
      BOSSitem.css("width", 100);
      BOSSitem.css("height", 100);
      BOSS.width = 100
      BOSS.height = 100
      BOSS.maxSpdX = 20;
      BOSS.maxSpdY = 20;
      BOSS.damage = 100;
    }

    if (BOSS.class === 2) {
      BOSSitem.css(
        "box-shadow",
        "0px 0px 20px gold, 0px 0px 20px gold inset"
      );
      BOSSitem.css("border-color", "gold");
      BOSSitem.css("width", 100);
      BOSSitem.css("height", 100);
      BOSS.width = 100
      BOSS.height = 100
      BOSS.maxSpdX = 8;
      BOSS.maxSpdY = 8;
      BOSS.damage = 40;
    }

    if (BOSS.class === 3) {
      BOSSitem.css(
        "box-shadow",
        "0px 0px 20px dimgray, 0px 0px 20px dimgray inset"
      );
      BOSSitem.css("border-color", "dimgray");
      BOSSitem.css("width", 200);
      BOSSitem.css("height", 200);
      BOSS.width = 200
      BOSS.height = 200
      BOSS.maxSpdX = 3;
      BOSS.maxSpdY = 3;
      BOSS.damage = 20;
    }

    if (BOSS.class === 4) {
      BOSSitem.css(
        "box-shadow",
        "0px 0px 20px black, 0px 0px 20px black inset"
      );
      BOSSitem.css("border-color", "black");
      BOSSitem.css("width", 50);
      BOSSitem.css("height", 50);
      BOSS.width = 50
      BOSS.height = 50
      BOSS.maxSpdX = 12;
      BOSS.maxSpdY = 12;
      BOSS.damage = 50;
    }
  }

  function playerUnitys() {
    if (player.shield <= 0) {
      player.shield = 0
    }
    if (player.shield < player.maxShield) {
      player.shield++
    }

    if (player.hp <= player.maxHP / 5) {
      player.hp = player.hp + 1
    }

  }

  function playerFx() {
    if (player.hp < player.maxHP / 6) {
      $("#HP").css(
        "box-shadow", "0px 0px 20px red, 0px 0px 5px red inset"
      );
      $("#HP").css("border-color", "red");
      $("#HP").css("background-color", "red");
    } else {
      $("#HP").css(
        "box-shadow", "0px 0px 20px ghostwhite, 0px 0px 5px black inset"
      );
      $("#HP").css("border-color", "ghostwhite");
      $("#HP").css("background-color", "ghostwhite");
    }
  }

  function dash() {


  }




  /*function dieWin() {

    if (player.hp <= 0) {
      endGame()
    }

    if (BOSS.hp <= 0) {
      endGame()
    }
  }



  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }*/
}
