$(document).ready(runProgram)

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
    //-----------------Game Variables---------------------//
    var board = {
        widthMax: $("#board").width(),
        widthMin: $("#board").width() - $("#board").width(),
        heightMax: $("#board").height(),
        heightMin: $("#board").height() - $("#board").height()
    }

    var KEY = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        w: 87,
        a: 65,
        s: 83,
        d: 68,
        space: 32,

    }

    var player = {
        posX: 10,
        posY: 10,
        spdX: 0,
        spdY: 0,
        width: $("#player").width(),
        height: $("#player").height()
    }

    //--------------Core Setup------------------------//
    let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
    $(document).on('keydown', handleKeyDown);
    $(document).on('keyup', handleKeyUp);


    function newFrame() {
        moveItems()
        redraw()

    }

    function handleKeyDown(event){
        if(event.which === KEY.w){
            player.spdY = -5
        }
        if(event.which === KEY.s){
            player.spdY = 5
        }
        if(event.which === KEY.a){
            player.spdX = -5
        }
        if(event.which === KEY.d){
            player.spdX = 5
        }

        if(event.which === KEY.space){
            makeBullet()
        }

    }

    function handleKeyUp(event){
        if(event.which === KEY.w){
            player.spdY = 0
        }
        if(event.which === KEY.s){
            player.spdY = 0
        }
        if(event.which === KEY.a){
            player.spdX = 0
        }
        if(event.which === KEY.d){
            player.spdX = 0
        }


    }
    //--------------Helper Functions------------------------//

    function moveItems(){
        player.posX += player.spdX
        player.posY += player.spdY

    }

    function redraw(){
        $("#player").css('left', player.posX)
        $("#player").css('top', player.posY)

    }

    function makeBullet(){

    }
}