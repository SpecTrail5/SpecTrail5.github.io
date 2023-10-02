$(document).ready(runProgram);

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

    //--------------- Game Variables ---------------//
    const audioHit = document.getElementById('HIT')
    const audioHit2 = document.getElementById('HIT2')

    var boxItem = $("#box")
    var ball0Item = $("#ball0")
    var ball1Item = $("#ball1")


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
        posX: 180,
        posY: 180,
        spdX: 0,
        spdY: 0,
        width: $("#center").width(),
        height: $("#center").height(),
    };

    var ball0 = {
        posX: 0,
        posY: 180,
        spdX: 2,
        spdY: 0,
        width: $("#ball0").width(),
        height: $("#ball0").height(),
    };

    var ball1 = {
        posX: 210,
        posY: 180,
        spdX: 0,
        spdY: 2,
        width: $("#ball1").width(),
        height: $("#ball1").height(),
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

        ball1.posX += ball1.spdX
        ball1.posY += ball1.spdY


    }

    function redraw() {
        ball0Item.css('left', ball0.posX)
        ball0Item.css('top', ball0.posY)

        ball1Item.css('left', ball1.posX)
        ball1Item.css('top', ball1.posY)

    }

    function border() {
        if (ball0.posX + ball0.width > box.posX + box.width) {
            ball0.spdX = ball0.spdX * -1
        }

        if (ball0.posX < box.posX) {
            ball0.spdX = ball0.spdX * -1
        }

        if (ball1.posY + ball1.height > box.posY + box.height) {
            ball1.spdY = ball1.spdY * -1
        }

        if (ball1.posY < box.posY) {
            ball1.spdY = ball1.spdY * -1
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

        if (collide(ball0, center)) {

            audioHit.play()
    
        }

        if (collide(ball1, center)) {

            audioHit2.play()
    
        }

    }


}
