
$(document).ready(runProgram);

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;


    var objectItem = $("#here")

    var object = {
        posX: 525,
        posY: 175,
        spd: 5,
        spdX: -10,
        spdY: -10,

    }



    let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);


    function newFrame() {
        moveGameItems()
        redraw();
        stayInBounds()


    }



    function moveGameItems() {

        object.posX += object.spdX
        object.posY += object.spdY

    }


    function redraw() {
        objectItem.css('left', object.posX)
        objectItem.css('top', object.posY)

    }


function stayInBounds() {

    if(object.posX > screen.width) {
        object.spdX = -object.spd
    }
    if(object.posX < screenLeft) {
        object.spdX = object.spd
    }

    if(object.posY > screen.height) {
        object.spdY = -object.spd
    }
    if(object.posY < screenTop) {
        object.spdY = object.spd
    }


    }

}

