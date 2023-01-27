$(document).ready(runProgram);

function runProgram() {
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  //--------------- Game Variables ---------------//

  var playerItem = $("#player");
  var BOSSitem = $("#BOSS");
  var bulletItem = $("#bullet");

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
    maxHP: 100,
    hp: 500,
    armor: 5,
    posX: 100,
    posY: 300,
    spdX: 0,
    spdY: 0,
    width: $("#player").width(),
    height: $("#player").height(),
  };

  // bullet
  var bullet = {
    count: 0,
    damage: 15,
    posX: 100,
    posY: 300,
    spdX: 0,
    spdY: 0,
    width: $("#bullet").width(),
    height: $("#bullet").height(),
  };

  // BOSS
  var BOSS = {
    maxHP: 1000,
    hp: 10000,
    damage: 10,
    classdur: 1500,
    class: 0,
    posX: 1000,
    posY: 300,
    maxSpdX: 15.5,
    maxSpdY: 15.5,
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
      playerBullet();
      bullet.count = bullet.count + 1;
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

    bullet.posX += bullet.spdX;
    bullet.posY += bullet.spdY;
  }

  function redraw() {
    playerItem.css("left", player.posX);
    playerItem.css("top", player.posY);

    BOSSitem.css("left", BOSS.posX);
    BOSSitem.css("top", BOSS.posY);

    bulletItem.css("left", bullet.posX);
    bulletItem.css("top", bullet.posY);

    $("#HP").css("width", player.hp);
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
    if (bullet.count > 0) {
      if (bullet.posX > BOSS.posX + BOSS.width) {
        bullet.spdX = -25;
      }
      if (bullet.posX < BOSS.posX) {
        bullet.spdX = 25;
      }
      if (bullet.posX === BOSS.posX - 40) {
        bullet.spdX = 0;
      }
      if (bullet.posY > BOSS.posY + BOSS.height) {
        bullet.spdY = -25;
      }
      if (bullet.posY < BOSS.posY - BOSS.height) {
        bullet.spdY = 25;
      }
      if (bullet.posY === BOSS.posY - 40) {
        bullet.spdY = 0;
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
      player.hp = player.hp - BOSS.damage / player.armor;
    }
  }

  function bossClass() {
    BOSS.classdur = BOSS.classdur - 1;
    if (BOSS.classdur <= 0) {
      BOSS.class = Math.ceil(Math.random() * 4);
    }

    if (BOSS.class === 0) {
      BOSSitem.css(
        "box-shadow",
        "0px 0px 20px darkblue, 0px 0px 20px darkblue inset"
      );
      BOSSitem.css("border-color", "darkblue");
      BOSSitem.css("width", 100);
      BOSSitem.css("height", 100);
      BOSS.maxSpdX = 2.5;
      BOSS.maxSpdY = 2.5;
      BOSS.damage = 10;
    }
  }

  function playerBullet() {
    
    $("<div>")
      .attr("id", "bullet")
      .css("width", 25)
      .css("height", 25)
      .css("background", "red")
      .css("position", "absolute")
      .css("left", bullet.posX)
      .css("top", bullet.posY)
      .appendTo($("#board"));
  }
}
