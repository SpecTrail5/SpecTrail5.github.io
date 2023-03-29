$(document).ready(runProgram);

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
    // game variables

    var playerItem = $("#player")

    var pointItem = $("#point")

    var a = Math.ceil(Math.random() * 2)
    var b = Math.ceil(Math.random() * 2)



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

    //The point
    var point = {
        posX: 525,
        posY: 175,
        spdX: (a < 2) ? 10 : -10,
        spdY: (b < 2) ? 10 : -10,
        widthMax: pointItem.width(),
        widthMin: pointItem.width() - pointItem.width(),
        heightMax: pointItem.height(),
        heightMin: pointItem.height() - pointItem.height()

    }

    // Player
    var player = {
        posX: point.widthMax / 2,
        posY: point.heightMax / 2,
        spdX: 0,
        spdY: 0,
        width: playerItem.width(),
        height: playerItem.height()
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
        makeEnemy()

    }


    function handleKeyDown(event) {

        if (event.which === KEY.w) {
            player.spdY = -20
        }
        if (event.which === KEY.s) {
            player.spdY = 20
        }
        if (event.which === KEY.a) {
            player.spdX = -20
        }
        if (event.which === KEY.d) {
            player.spdX = 20
        }


    }


    function handleKeyUp(event) {

        if (event.which === KEY.w) {
            player.spdY = 0
        }
        if (event.which === KEY.s) {
            player.spdY = 0
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
        player.posX += player.spdX
        player.posY += player.spdY

        point.posX += point.spdX
        point.posY += point.spdY


    }


    function stayInBounds() {

        // player in point
        if (player.posX >= point.widthMax - player.width) {
            player.posX = point.widthMax - player.width * 2
        }
        if (player.posX <= point.widthMin) {
            player.posX = point.widthMin + player.width
        }
        if (player.posY >= point.heightMax - player.height) {
            player.posY = point.heightMax - player.height * 2
        }
        if (player.posY <= point.heightMin) {
            player.posY = point.heightMin + player.height
        }

        // point in board
        if (point.posX >= board.widthMax - point.widthMax) {
            point.spdX = point.spdX * -1
        }
        if (point.posX <= board.widthMin) {
            point.spdX = point.spdX * -1
        }
        if (point.posY >= board.heightMax - point.heightMax) {
            point.spdY = point.spdY * -1
        }
        if (point.posY <= board.heightMin) {
            point.spdY = point.spdY * -1
        }

    }



    function redraw() {
        playerItem.css('left', player.posX)
        playerItem.css('top', player.posY)

        pointItem.css('left', point.posX)
        pointItem.css('top', point.posY)

    }


    function makeEnemy() {

        const enemy = document.createElement("div");
        enemy.x 


        document.getElementById("#board").appendChild(enemy);
    }




    function endGame() {
        // stop the interval timer
        clearInterval(interval);

        // turn off event handlers
        $(document).off();
    }
}