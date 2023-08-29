$(document).ready(runProgram);

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

    //--------------- Game Variables ---------------//
    const audioHit = document.getElementById('HIT')

    var boxItem = $("#box")
    var ball0Item = $("#ball0")


    // box
    var box = {
        posX: 0,
        posY: 0,
        spdX: 0,
        spdY: 0,
        width: $("#box").width(),
        height: $("#box").height(),
    };

    var center = {
        posX: 0,
        posY: 0,
        spdX: 0,
        spdY: 0,
        width: $("#center").width(),
        height: $("#center").height(),
    };

    var ball0 = {
        posX: 0,
        posY: $("#box").height() / 2.8,
        spdX: 5,
        spdY: 0,
        width: $("#ball0").width(),
        height: $("#ball0").height(),
    };



    // one-time setup
    let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);

    function newFrame() {
        moveGameItems();
        redraw();
        border();
        audio();
 
    }


    //--------------- Helper Functions ---------------//

    function moveGameItems() {
        ball0.posX += ball0.spdX
        ball0.posY += ball0.spdY


    }

    function redraw() {
        ball0Item.css('left', ball0.posX)
        ball0Item.css('top', ball0.posY)

    }

    function border() {
        if (ball0.posX + ball0.width > box.posX + box.width) {
            ball0.spdX = ball0.spdX * -1
        }

        if (ball0.posX < box.posX) {
            ball0.spdX = ball0.spdX * -1
        }

        if (ball0.posY + ball0.height > box.widthMax) {
            ball0.spdY = ball0.spdY * -1
        }

        if (ball0.posY < box.widthMin) {
            ball0.spdY = ball0.spdY * -1
        }

    }

    function collide(obj1, obj2) {

        obj1.left = obj1.posX
        obj1.right = obj1.posX + obj1.width
        obj1.top = obj1.posY
        obj1.bottom = obj1.posY + obj1.height

        obj2.left = obj2.posX
        obj2.right = obj2.posX + obj2.width
        obj2.top = obj2.posY
        obj2.bottom = obj2.posY + obj2.height

        if (obj1.left < obj2.right && obj1.right > obj2.left && obj1.top < obj2.bottom && obj1.bottom > obj2.top) {

            return true

        } else {
            return false
        }

    }

    function audio() {
       
       let hit = collide(ball0, center)
        if (hit === true) {
            audioHit.play()

        }
        
    }


}
