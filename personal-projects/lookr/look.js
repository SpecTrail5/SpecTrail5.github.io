$(document).ready(runProgram);

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
    // game variables


    // controls
    var KEY = {
        space: 32,
        p: 80,
        w: 87,
        a: 65,
        s: 83,
        d: 68,
        j: 74,
        k: 75,
        i: 73,
        l: 76,
        zero: 48,
        one: 49,
        two: 50,
        three: 51,
        four: 52,
        five: 53,
        six: 54,
        seven: 55,
        eight: 56,
        nine: 57
    }

    const mousePosText = document.getElementById('mouse-pos');

    let mousePos = {
        x: undefined,
        y: undefined,
    };

    // pupil modes
    var follow = 0
    var sync = 0

    // emotion modes
    var angry = 0
    var sad = 0

    var eyeLItem = $("#eyeL")

    var eyeL = {
        left: 100,
        right: 100 + $("#eyeL").width(),
        top: 150,
        bottom: 150 + $("#eyeL").height(),
    }

    var eyeR = {
        left: 300,
        right: 300 + $("#eyeR").width(),
        top: 150,
        bottom: 150 + $("#eyeR").height(),
    }


    var pupilL = {
        x: 0,
        y: 0,
        movespd: 1,
        moveX: 0,
        moveY: 0,
        width: 50,
        height: 50
    }

    var pupilR = {
        x: 0,
        y: 0,
        movespd: 1,
        moveX: 0,
        moveY: 0,
        width: 50,
        height: 50
    }


    let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
    $(document).on('keydown', handleKeyDown);
    $(document).on('keyup', handleKeyUp);

    window.addEventListener('mousemove', (event) => {
        mousePos = { x: event.clientX, y: event.clientY };
        mousePosText.textContent = `(${mousePos.x}, ${mousePos.y})`;
    });


    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// CORE LOGIC ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    /* 
    On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
    by calling this function and executing the code inside.
    */
    function newFrame() {
        followMouse()
        redraw();
        border()

    }

    /* 
    Called in response to events.
    */
    function handleKeyDown(event) {

        // Left pupil move
        if (event.which === KEY.w) {
            if (follow === 0) {
                pupilL.moveY = -pupilL.movespd
            }
            if (sync === 1) {
                pupilR.moveY = -pupilR.movespd
            }

        }

        if (event.which === KEY.s) {
            if (follow === 0) {
                pupilL.moveY = pupilL.movespd
            }
            if (sync === 1) {
                pupilR.moveY = pupilR.movespd
            }

        }

        if (event.which === KEY.a) {
            if (follow === 0) {
                pupilL.moveX = -pupilL.movespd
            }
            if (sync === 1) {
                pupilR.moveX = -pupilR.movespd
            }

        }

        if (event.which === KEY.d) {
            if (follow === 0) {
                pupilL.moveX = pupilL.movespd
            }
            if (sync === 1) {
                pupilR.moveX = pupilR.movespd
            }

        }

        //Right pupil move
        if (event.which === KEY.l) {

            if (follow === 0) {
                if (sync === 0) {
                    pupilR.moveX = pupilR.movespd
                }
            }

        }

        if (event.which === KEY.j) {
            if (follow === 0) {
                if (sync === 0) {
                    pupilR.moveX = -pupilR.movespd
                }
            }

        }

        if (event.which === KEY.i) {
            if (follow === 0) {
                if (sync === 0) {
                    pupilR.moveY = -pupilR.movespd
                }
            }

        }

        if (event.which === KEY.k) {
            if (follow === 0) {
                if (sync === 0) {
                    pupilR.moveY = pupilR.movespd
                }
            }

        }





        // toggle follow mouse
        if (event.which === KEY.one) {
            if (follow === 0) {
                follow = 1
                $("#follow").css('background', 'lime')
                $("#follow").text("'1' follow: on")

                sync = 0
                $("#sync").css('background', 'red')
                $("#sync").text("'2' Sync: off")
            } else if (follow === 1) {
                follow = 0
                $("#follow").css('background', 'red')
                $("#follow").text("'1' follow: off")
            }

        }

        //toggle pupil sync
        if (event.which === KEY.two) {
            if (sync === 0) {
                sync = 1
                $("#sync").css('background', 'lime')
                $("#sync").text("'2' Sync: on")

                follow = 0
                $("#follow").css('background', 'red')
                $("#follow").text("'1' follow: off")

            } else if (sync === 1) {
                sync = 0
                $("#sync").css('background', 'red')
                $("#sync").text("'2' Sync: off")
            }

        }

        //toggle angry
        if (event.which === KEY.six) {
            toggleAngry()

        }

        //toggle sad
        if (event.which === KEY.seven) {
            toggleSad()
        }

    }


    function handleKeyUp(event) {


        // Left pupil stop
        if (event.which === KEY.w) {
            if (follow === 0) {
                pupilL.moveY = 0
            }
            if (sync === 1) {
                pupilR.moveY = 0
            }

        }

        if (event.which === KEY.s) {
            if (follow === 0) {
                pupilL.moveY = 0
            }
            if (sync === 1) {
                pupilR.moveY = 0
            }

        }

        if (event.which === KEY.a) {
            if (follow === 0) {
                pupilL.moveX = 0
            }
            if (sync === 1) {
                pupilR.moveX = 0
            }

        }

        if (event.which === KEY.d) {
            if (follow === 0) {
                pupilL.moveX = 0
            }
            if (sync === 1) {
                pupilR.moveX = 0
            }

        }

        // Right pupil stop
        if (event.which === KEY.i) {
            if (follow === 0) {
                pupilR.moveY = 0
            }

        }

        if (event.which === KEY.k) {
            if (follow === 0) {
                pupilR.moveY = 0
            }

        }

        if (event.which === KEY.j) {
            if (follow === 0) {
                pupilR.moveX = 0
            }

        }

        if (event.which === KEY.l) {
            if (follow === 0) {
                pupilR.moveX = 0
            }

        }



    }

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////


    function followMouse() {
        pupilL.x += pupilL.moveX
        pupilL.y += pupilL.moveY

        pupilR.x += pupilR.moveX
        pupilR.y += pupilR.moveY


        if (follow === 1) {

            //Left pupil follow mouse
            if (pupilL.x === mousePos.x) {
                pupilL.moveX = 0
            }
            if (pupilL.x < mousePos.x) {
                pupilL.moveX = pupilL.movespd
            }
            if (pupilL.x > mousePos.x) {
                pupilL.moveX = -pupilL.movespd
            }


            if (pupilL.y === mousePos.y) {
                pupilL.moveY = 0
            }
            if (pupilL.y < mousePos.y) {
                pupilL.moveY = pupilL.movespd
            }
            if (pupilL.y > mousePos.y) {
                pupilL.moveY = -pupilL.movespd
            }

            //Right pupil follow mouse

            if (pupilR.x === mousePos.x) {
                pupilR.moveX = 0
            }
            if (pupilR.x < mousePos.x) {
                pupilR.moveX = pupilR.movespd
            }
            if (pupilR.x > mousePos.x) {
                pupilR.moveX = -pupilR.movespd
            }


            if (pupilR.y === mousePos.y) {
                pupilR.moveY = 0
            }
            if (pupilR.y < mousePos.y) {
                pupilR.moveY = pupilR.movespd
            }
            if (pupilR.y > mousePos.y) {
                pupilR.moveY = -pupilR.movespd
            }
        }


    }


    function border() {

        if (pupilL.x >= eyeL.right - pupilL.width) {
            pupilL.x = eyeL.right - pupilL.width
        }

        if (pupilL.x <= eyeL.left) {
            pupilL.x = eyeL.left
        }

        if (pupilL.y >= eyeL.bottom - pupilL.height) {
            pupilL.y = eyeL.bottom - pupilL.height
        }

        if (pupilL.y <= eyeL.top) {
            pupilL.y = eyeL.top
        }


        if (pupilR.x >= eyeR.right - pupilR.width) {
            pupilR.x = eyeR.right - pupilR.width
        }

        if (pupilR.x <= eyeR.left) {
            pupilR.x = eyeR.left
        }

        if (pupilR.y >= eyeR.bottom - pupilR.height) {
            pupilR.y = eyeR.bottom - pupilR.height
        }

        if (pupilR.y <= eyeR.top) {
            pupilR.y = eyeR.top
        }

    }


    function redraw() {
        $("#pupilL").css('left', pupilL.x)
        $("#pupilL").css('top', pupilL.y)

        $("#pupilR").css('left', pupilR.x)
        $("#pupilR").css('top', pupilR.y)

    }

    //=================== Toggle Emotions ===================//
    //=================== below this line ===================//



    function toggleSad() {

        if (sad === 0) {
            sad = 1
            $("#sad").css('background', 'lime')
            $("#sad").text("'7' sad: yes")

            $("#browL").css('rotate', '-10deg')
            $("#browR").css('rotate', '10deg')
            $("#pupilL").css('background', 'blue')
            $("#pupilR").css('animation-name', 'none')
            $("#pupilR").css('background', 'blue')
            $("#pupilR").css('box-shadow', '0px 0px 20px 5px blue')
            $("#mouth").css('border-top-left-radius', '50%')
            $("#mouth").css('border-top-right-radius', '50%')


        } else if (sad === 1) {
            sad = 0
            $("#sad").css('background', 'red')
            $("#sad").text("'7' sad: no")

            $("#browL").css('rotate', '0deg')
            $("#browR").css('rotate', '0deg')
            $("#pupilL").css('background', 'black')
            $("#pupilR").css('animation-name', 'changecolor')
            $("#mouth").css('border-top-left-radius', '0%')
            $("#mouth").css('border-top-right-radius', '0%')
        }

    }

    function toggleAngry (){

        if (angry === 0) {
            angry = 1
            $("#angry").css('background', 'lime')
            $("#angry").text("'6' angry: yes")

            $("#browL").css('rotate', '10deg')
            $("#browR").css('rotate', '-10deg')
            $("#pupilL").css('background', 'red')
            $("#pupilR").css('animation-name', 'none')
            $("#pupilR").css('background', 'red')
            $("#pupilR").css('box-shadow', '0px 0px 20px 5px red')

            $("#mouth").css('border-top-left-radius', '50%')
            $("#mouth").css('border-top-right-radius', '50%')

        } else if (angry === 1) {
            angry = 0
            $("#angry").css('background', 'red')
            $("#angry").text("'6' angry: no")

            $("#browL").css('rotate', '0deg')
            $("#browR").css('rotate', '0deg')
            $("#pupilL").css('background', 'black')
            $("#pupilR").css('animation-name', 'changecolor')

            $("#mouth").css('border-top-left-radius', '0%')
            $("#mouth").css('border-top-right-radius', '0%')

        }

    }



}