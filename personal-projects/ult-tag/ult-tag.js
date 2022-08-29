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
        space: 32,
        w: 87,
        a: 65,
        s: 83,
        d: 68,

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

    var platform = {
        
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
    }

    function handleKeyDown(event) {
        if (event.which === KEY.w) {
            player1.spdY = -10
        }

        if (event.which === KEY.s) {
            player1.spdY = 10
        }

        if (event.which === KEY.a) {
            player1.spdX = -10
        }

        if (event.which === KEY.d) {
            player1.spdX = 10
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


    }

    //------------------------ HELPER FUNCTIONS ---------------------------//


    function border() {
        if (player1.posY >= board.heightMax - player1.height) {
            player1.posY = board.heightMax - player1.height
        }

        if(player1.posY <= board.heightMin){
            player1.posY = board.heightMin
        }

        if(player1.posX >= board.widthMax - player1.width){
            player1.posX = board.widthMax - player1.width
        }

        if(player1.posX <= board.widthMin){
            player1.posX = board.widthMin
        }
    }

    function moveGameItems() {
        player1.posX += player1.spdX
        player1.posY += player1.spdY

    }

    function redraw() {
        $("#player1").css('left', player1.posX)
        $("#player1").css('top', player1.posY)

    }



    function endGame() {

        clearInterval(interval);

        $(document).off();
    }
}