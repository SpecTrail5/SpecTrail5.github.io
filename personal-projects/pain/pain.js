$(document).ready(runProgram);

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
    // game variables

    var playerItem = $("#player")
    var groundItem = $("#ground")

    createPlatForm(440, 350, 200, 20)
    createPlatForm(40, 350, 200, 20)
    


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
    var player = {
        onGround: 1,
        jumpCap: 1,
        maxJumps: 5,
        jumps: 0,
        x: 100,
        y: 600,
        maxSpd: 10,
        spdX: 0,
        spdY: 0,
        width: playerItem.width(),
        height: playerItem.height(),
    }


    var ground = {
        x: 0,
        y: 550,
        width: groundItem.width(),
        height: groundItem.height()
    }

    const platformObj = {
        id: document.getElementById("platform"),
        x: document.getElementById("platform").offsetLeft,
        y: document.getElementById("platform").offsetTop,
        width: document.getElementById("platform").offsetWidth,
        height: document.getElementById("platform").offsetHeight
    }





    // one-time setup
    let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
    $(document).on('keydown', handleKeyDown);
    $(document).on('keyup', handleKeyUp);


    ///////////////////////// CORE LOGIC ///////////////////////////////////////////



    function newFrame() {
        moveGameItems()
        redraw();
        stayInBounds()
        touchground()
        collidePlatform(platformObj)

    }


    function handleKeyDown(event) {

        if (event.which === KEY.w && player.jumps > 0 && player.jumpCap > 0) {
            player.spdY = -5
            player.jumps--
            player.jumpCap--
        } else if (event.which === KEY.s && player.onGround === 0) {
            player.spdY = 25
        }
        if (event.which === KEY.a) {
            player.spdX = -player.maxSpd
        } else if (event.which === KEY.d) {
            player.spdX = player.maxSpd
        }


    }


    function handleKeyUp(event) {

if(event.which === KEY.w){
    player.jumpCap = 1
}

        if (event.which === KEY.a) {
            player.spdX = 0
        }
        if (event.which === KEY.d) {
            player.spdX = 0
        }

    }

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    function moveGameItems() {
        player.x += player.spdX
        player.y += player.spdY

    }


    function stayInBounds() {


        // player in board
        if (player.x >= board.widthMax) {
            player.x = board.widthMax - (player.width * 2)
            player.spdX = 0
        }
        if (player.x <= board.widthMin) {
            player.x = board.widthMin + player.width
            player.spdX = 0
        }
        if (player.y >= board.heightMax) {
            player.y = board.heightMax - (player.height * 2)
            player.spdY = 0
        }
        if (player.y <= board.heightMin) {
            player.y = board.heightMin + player.height
            player.spdY = 0
        }

    }



    function redraw() {
        playerItem.css('left', player.x)
        playerItem.css('top', player.y)

        groundItem.css('top', ground.y)

    }



    function collide(obj1, obj2, mode) {

        obj1.left = obj1.x + obj1.width
        obj1.right = obj1.x
        obj1.top = obj1.y
        obj1.bottom = obj1.y + obj1.height

        obj2.left = obj2.x + obj2.width
        obj2.right = obj2.x
        obj2.top = obj2.y
        obj2.bottom = obj2.y + obj2.height

        if (obj1.left > obj2.right && obj1.right < obj2.left && obj1.top < obj2.bottom && obj1.bottom > obj2.top && mode === 1) {

            return true
        } else if (obj1.left > obj2.right && obj1.right < obj2.left && obj1.top < obj2.bottom && obj1.top > obj2.top && mode === 2) {

            return true
        } else if (obj1.bottom > obj2.top && obj1.x > obj2.x && obj1.y < obj2.y && obj1.x < obj2.left && obj1.top > !obj2.top && mode === 3) {

            return true
        } else {
            return false
        }

    }

    function touchground() {


        if ((player.y + player.height) > ground.y) {
            player.y = ground.y - player.height + 0.1
            player.spdY = 0
        }


        if (collide(player, ground, 1) === true) {
            player.onGround = 1
            player.jumps = player.maxJumps

        } else if (collide(player, ground, 1) === false) {
            player.onGround = 0
            gavitiy()
        }

    }


    function gavitiy() {

        if (player.onGround === 0) {
            player.spdY = player.spdY + 0.2
        } else if (player.onGround === 1) {
            player.spdY = player.spdY
        }
    }


    function collidePlatform(platform) {

        if (collide(player, platform, 2)) {
            player.y = platform.y + platform.height + 1
            player.spdY = 0
        } else if (collide(player, platform, 3)) {
            player.y = platform.y - player.height + 0.1
            player.spdY = 0
            player.onGround = 1
            player.jumps = player.maxJumps
        }


    }


    function endGame() {
        // stop the interval timer
        clearInterval(interval);

        // turn off event handlers
        $(document).off();
    }
}