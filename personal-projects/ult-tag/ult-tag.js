$(document).ready(runProgram)

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
    // game variables

    var time = {
        dur: $("#timer").width(),
        cap: 1000
    }

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
        tag: 0,
        trig: 1,
        dur: $("#p1Dur").width(),
        speed: 10,
        coolDown: $("#p1Cool").width(),
        spdX: 0,
        spdY: 0,
        posX: 100,
        posY: 150,
        width: $("#player1").width(),
        height: $("#player1").height()
    }

    var player2 = {
        tag: 0,
        charge: 3,
        coolDown: $("#p2Cool").width(),
        spdX: 0,
        spdY: 0,
        posX: 1050,
        posY: 400,
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
        p1Power()
        p2Power()
        timer()
    }

    function handleKeyDown(event) {
        //---------Player1 controls-------//
        if (event.which === KEY.w) {
            player1.spdY = -player1.speed
        }

        if (event.which === KEY.s) {
            player1.spdY = player1.speed
        }

        if (event.which === KEY.a) {
            player1.spdX = -player1.speed
        }

        if (event.which === KEY.d) {
            player1.spdX = player1.speed
        }

        if (event.which === KEY.q && player1.dur > 0) {
            player1.trig = 0
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
        if (event.which === KEY.shift && player2.charge > 0) {
            player2.posX = Math.random() * board.widthMax
            player2.posY = Math.random() * board.heightMax
            player2.charge = player2.charge - 1
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

        $("#p1Dur").css('width', player1.dur)
        $("#p1Cool").css('width', player1.coolDown)

        $("#player2").css('left', player2.posX)
        $("#player2").css('top', player2.posY)

        $("#p2Cool").css('width', player2.coolDown)

        $("#timer").css('width', time.dur)
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
            
        }
    }

    function tag() {

        var ran = Math.ceil(Math.random(1) * 2)
        var not = 3
        if(not === 3){
            not = ran
        }
        if (not === 1){
            not = 2
        }
        if(not === 2){
            not = 1
        }

        if(not === 1){
            player1.tag = 1
            player2.tag = 0
        }else if (not === 2){
            player2.tag = 1
            player1.tag = 0
        }
        if(player1.tag === 1){
            $("#player1").css('box-shadow', '0px 0px 20px 20px purple, 0px 0px 20px orangered inset')
        }else if(player1.tag === 0) {
            $("#player1").css('box-shadow', '0px 0px 20px orangered, 0px 0px 10px orangered inset')
        }

        if(player2.tag === 1){
            $("#player2").css('box-shadow', '0px 0px 20px 20px purple, 0px 0px 20px aqua inset')
        }else if (player2.tag === 0){
            $("#player2").css('box-shadow', '0px 0px 20px aqua, 0px 0px 10px aqua inset')
        }
    }

    function timer(){
        time.dur = time.dur - 1
        if(time.dur <= 0){
            tag()
            time.dur = time.cap
        }
    }

    function p1Power() {
        if (player1.trig === 0) {
            player1.speed = 25
            player1.dur = player1.dur - 1
        }

        if (player1.dur === 0) {
            player1.speed = 10
            player1.trig = 1
            player1.coolDown = player1.coolDown + 1
        }

        if (player1.coolDown === 400) {
            player1.dur = 400
            player1.coolDown = 0
        }

    }

    function p2Power() {

        if (player2.charge === 0) {
            player2.coolDown = player2.coolDown + 2


        } if (player2.coolDown >= 400) {
            player2.charge = 3

        } if (player2.charge === 3) {
            player2.coolDown = 0
        }


        if (player2.charge === 3) {
            $("#p2C3").show()
        } else {
            $("#p2C3").hide()
        }


        if (player2.charge >= 2) {
            $("#p2C2").show()
        } else {
            $("#p2C2").hide()
        }


        if (player2.charge >= 1) {
            $("#p2C1").show()
        } else {
            $("#p2C1").hide()
        }

    }

    function endGame() {

        clearInterval(interval);

        $(document).off();
    }
}