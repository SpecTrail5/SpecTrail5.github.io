$(document).ready(runProgram)

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
    // game variables



    var board = {
        widthMax: $("#board").width(),
        widthMin: $("#board").width() - $("#board").width(),
        heightMax: $("#board").height(),
        heightMin: $("#board").height() - $("#board").height()
    }


    // controls
    var KEY = {
        q: 81,
        shift: 16,
        space: 32,
        w: 87,
        a: 65,
        s: 83,
        d: 68,
        left: 37,
        right: 39,
        up: 38,
        down: 40

    }

    // Player
    var player1 = {
        spdX: 0,
        spdY: 0,
        posX: 100,
        posY: 100,
        width: $("#player1").width(),
        height: $("#player1").height()
    }

    var player2 = {
        coolDown: 100,
        spdX: 0,
        spdY: 0,
        posX: 1050,
        posY: 500,
        width: $("#player2").width(),
        height: $("#player2").height()
    }



    // one-time setup
    let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
    $(document).on('keydown', handleKeyDown);
    $(document).on('keyup', handleKeyUp);

    //----------------------------CORE LOGIC--------------------------//


    function newFrame() {
        moveGameItems()
        redraw()
        border()
        collide(player1, player2)
        p2CoolDown()
    }

    function handleKeyDown(event) {
        //---------Player1 controls-------//
        if (event.which === KEY.w) {
            player1.spdY = -20
        }

        if (event.which === KEY.s) {
            player1.spdY = 20
        }

        if (event.which === KEY.a) {
            player1.spdX = -20
        }

        if (event.which === KEY.d) {
            player1.spdX = 20
        }


        //---------Player2 controls-------//
        if (event.which === KEY.up) {
            player2.spdY = -10
        }

        if (event.which === KEY.down) {
            player2.spdY = 10
        }

        if (event.which === KEY.left) {
            player2.spdX = -10
        }

        if (event.which === KEY.right) {
            player2.spdX = 10
        }
        if(event.which === KEY.shift && player2.coolDown <= 0){
            player2.posX = Math.random() * board.widthMax
            player2.posY = Math.random() * board.heightMax
            player2.coolDown = 100
        }

    }


    function handleKeyUp(event) {
        if (event.which === KEY.w) {
            player1.spdY = 0
        }

        if (event.which === KEY.s) {
            player1.spdY = 0
        }

        if (event.which === KEY.a) {
            player1.spdX = 0
        }

        if (event.which === KEY.d) {
            player1.spdX = 0
        }

        if (event.which === KEY.up) {
            player2.spdY = 0
        }

        if (event.which === KEY.down) {
            player2.spdY = 0
        }

        if (event.which === KEY.left) {
            player2.spdX = 0
        }

        if (event.which === KEY.right) {
            player2.spdX = 0
        }

    }

    //------------------------ HELPER FUNCTIONS ---------------------------//


    function border() {
        if (player1.posY >= board.heightMax - player1.height) {
            player1.posY = board.heightMax - player1.height
        }

        if (player1.posY <= board.heightMin) {
            player1.posY = board.heightMin
        }

        if (player1.posX >= board.widthMax - player1.width) {
            player1.posX = board.widthMax - player1.width
        }

        if (player1.posX <= board.widthMin) {
            player1.posX = board.widthMin
        }

        if (player2.posY >= board.heightMax - player2.height) {
            player2.posY = board.heightMax - player2.height
        }

        if (player2.posY <= board.heightMin) {
            player2.posY = board.heightMin
        }

        if (player2.posX >= board.widthMax - player2.width) {
            player2.posX = board.widthMax - player2.width
        }

        if (player2.posX <= board.widthMin) {
            player2.posX = board.widthMin
        }
    }

    function moveGameItems() {
        player1.posX += player1.spdX
        player1.posY += player1.spdY

        player2.posX += player2.spdX
        player2.posY += player2.spdY

    }

    function redraw() {
        $("#player1").css('left', player1.posX)
        $("#player1").css('top', player1.posY)

        $("#player2").css('left', player2.posX)
        $("#player2").css('top', player2.posY)
    }

    function collide(obj1, obj2) {
        obj1.left = obj1.posX
        obj1.right = obj1.posX + obj1.width
        obj1.top = obj1.posY
        obj1.buttom = obj1.posY + obj1.height

        obj2.left = obj2.posX
        obj2.right = obj2.posX + obj2.width
        obj2.top = obj2.posY
        obj2.buttom = obj2.posY + obj2.height

        if (obj1.buttom > obj2.top && obj1.top < obj2.buttom && obj1.left < obj2.right && obj1.right > obj2.left) {
            $("#player1").css('background', 'black')
        }
    }

    function p2CoolDown(){
        player2.coolDown = player2.coolDown - 1

    }

    function endGame() {

        clearInterval(interval);

        $(document).off();
    }
}