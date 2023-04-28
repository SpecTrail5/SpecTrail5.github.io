$(document).ready(runProgram);

function runProgram() {
    const FRAME_RATE = 60;
    const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
    // game variables

    var player1Item = $("#player1")
    var player2Item = $("#player2")
    var enemyItem = $("#enemy")
    var groundItem = $("#ground")

    createPlatForm(300, 350, 400, 20)



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
        arrowUp: 38,
        arrowDown: 40,
        arrowLeft: 37,
        arrowRight: 39,
        j: 74,
        k: 75,
        i: 73,
        l: 76

    }


    // Player1
    var player1 = {
        maxHP:250,
        hp: 250,
        regen: 0.1,
        slam: 1,
        maxDamage: 250,
        dmgRate: 0.5,
        damage: 0,
        onGround: 1,
        jumpCap: 1,
        maxJumps: 5,
        jumps: 0,
        x: 100,
        y: 600,
        maxSpd: 10,
        spdX: 0,
        spdY: 0,
        width: player1Item.width(),
        height: player1Item.height(),
        friction: {
            max: 1,
            value: 0.5
        }
    }

    // Player2
    var player2 = {
        maxHP:250,
        hp: 250,
        regen: 0.1,
        slam: 1,
        maxDamage: 40,
        dmgRate: 0.5,
        damage: 0,
        onGround: 1,
        jumpCap: 1,
        maxJumps: 5,
        jumps: 0,
        x: 800,
        y: 600,
        maxSpd: 10,
        spdX: 0,
        spdY: 0,
        width: player2Item.width(),
        height: player2Item.height(),
        friction: {
            max: 1,
            value: 0.5
        }
    }

    // enemy
    var enemy = {
        hp: 1000,
        maxDamage: 40,
        minDamage: 20,
        x: 400,
        y: 275,
        spdX: -10,
        spdY: -5,
        width: enemyItem.width(),
        height: enemyItem.height(),
    }


    var ground = {
        x: 0,
        y: 520,
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
        stop()
        playerHit()
        playerGainDmg(player1)
        playerGainDmg(player2)
        playerRegen(player1)
        playerRegen(player2)

    }


    function handleKeyDown(event) {

        if (event.which === KEY.w && player1.jumps > 0 && player1.jumpCap > 0) {
            player1.spdY = -5
            player1.jumps--
            player1.jumpCap--
        } else if (event.which === KEY.s && player1.onGround === 0) {
            player1.spdY = 25
            player1.slam = 0
        }
        if (event.which === KEY.a) {
            player1.spdX = -player1.maxSpd
            player1.friction.value = 0
        } else if (event.which === KEY.d) {
            player1.spdX = player1.maxSpd
            player1.friction.value = 0
        }

        if (event.which === KEY.arrowUp && player2.jumps > 0 && player2.jumpCap > 0) {
            player2.spdY = -5
            player2.jumps--
            player2.jumpCap--
        } else if (event.which === KEY.arrowDown && player2.onGround === 0) {
            player2.spdY = 25
            player2.slam = 0
        }
        if (event.which === KEY.arrowLeft) {
            player2.spdX = -player2.maxSpd
            player2.friction.value = 0
        } else if (event.which === KEY.arrowRight) {
            player2.spdX = player2.maxSpd
            player2.friction.value = 0
        }




    }


    function handleKeyUp(event) {

        if (event.which === KEY.w) {
            player1.jumpCap = 1
        }

        if (event.which === KEY.a) {
            player1.friction.value = player1.friction.max
        } else if (event.which === KEY.d) {
            player1.friction.value = player1.friction.max
        }

        if (event.which === KEY.arrowUp) {
            player2.jumpCap = 1
        }

        if (event.which === KEY.arrowLeft) {
            player2.friction.value = player2.friction.max
        } else if (event.which === KEY.arrowRight) {
            player2.friction.value = player2.friction.max
        }

    }

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    function stop() {

        if (player1.spdX > 0) {
            player1.spdX = player1.spdX - player1.friction.value
        } else if (player1.spdX < 0) {
            player1.spdX = player1.spdX + player1.friction.value
        }

        if (player2.spdX > 0) {
            player2.spdX = player2.spdX - player2.friction.value
        } else if (player2.spdX < 0) {
            player2.spdX = player2.spdX + player2.friction.value
        }

    }

    function moveGameItems() {
        player1.x += player1.spdX
        player1.y += player1.spdY

        player2.x += player2.spdX
        player2.y += player2.spdY

        enemy.x += enemy.spdX
        enemy.y += enemy.spdY

    }


    function stayInBounds() {


        // player1 in board
        if (player1.x >= board.widthMax) {
            player1.x = board.widthMax - (player1.width * 2)
            player1.spdX = player1.spdX * -1
        }
        if (player1.x <= board.widthMin) {
            player1.x = board.widthMin + player1.width
            player1.spdX = player1.spdX * -1
        }
        if (player1.y >= board.heightMax) {
            player1.y = board.heightMax - (player1.height * 2)
            player1.spdY = player1.spdY * -1
        }
        if (player1.y <= board.heightMin) {
            player1.y = board.heightMin + player1.height
            player1.spdY = player1.spdY * -1
        }

        // player2 in board
        if (player2.x >= board.widthMax) {
            player2.x = board.widthMax - (player2.width * 2)
            player2.spdX = player2.spdX * -1
        }
        if (player2.x <= board.widthMin) {
            player2.x = board.widthMin + player2.width
            player2.spdX = player2.spdX * -1
        }
        if (player2.y >= board.heightMax) {
            player2.y = board.heightMax - (player2.height * 2)
            player2.spdY = player2.spdY * -1
        }
        if (player2.y <= board.heightMin) {
            player2.y = board.heightMin + player2.height
            player2.spdY = player2.spdY * -1
        }

        // enemy in board
        if (enemy.x >= board.widthMax - enemy.width) {
            enemy.spdX = enemy.spdX * -1
        }
        if (enemy.x <= board.widthMin) {
            enemy.spdX = enemy.spdX * -1
        }
        if (enemy.y >= board.heightMax - enemy.height) {
            enemy.spdY = enemy.spdY * -1
        }
        if (enemy.y <= board.heightMin) {
            enemy.spdY = enemy.spdY * -1
        }

    }



    function redraw() {
        player1Item.css('left', player1.x)
        player1Item.css('top', player1.y)

        player2Item.css('left', player2.x)
        player2Item.css('top', player2.y)

        enemyItem.css('left', enemy.x)
        enemyItem.css('top', enemy.y)

        groundItem.css('top', ground.y)

        $('#p1HP').css('width', player1.hp)
        $('#p1HP').text(Math.ceil(player1.hp))

        $('#p2HP').css('width', player2.hp)
        $('#p2HP').text(Math.ceil(player2.hp) )

        $('#p1dmg').css('width', player1.damage)
        $('#p1dmg').text(player1.damage)

        $('#p2dmg').css('width', '100px'+player2.damage)
        $('#p2dmg').css('width', player2.damage)
        $('#p2dmg').text(player2.damage)

        $('#enemyHP').css('width', enemy.hp)

    }



    function collide(obj1, obj2, mode) {

        obj1.left = obj1.x
        obj1.right = obj1.x + obj1.width
        obj1.top = obj1.y
        obj1.bottom = obj1.y + obj1.height

        obj2.left = obj2.x
        obj2.right = obj2.x + obj2.width
        obj2.top = obj2.y
        obj2.bottom = obj2.y + obj2.height

        /*if items collide at all*/
        if (obj1.left < obj2.right && obj1.right > obj2.left && obj1.top < obj2.bottom && obj1.bottom > obj2.top && mode === 'all') {

            return true
        } /*if items collide on bottom*/else if (obj1.left < obj2.right && obj1.right > obj2.left && obj1.top < obj2.bottom && obj1.top > obj2.top && mode === 'bottom') {

            return true
        } /*if items collide on top*/else if (obj1.bottom > obj2.top && obj1.x > obj2.x && obj1.y < obj2.y && obj1.x < obj2.right && obj1.top > !obj2.top && mode === 'top') {

            return true
        } else if (obj1.left < obj2.left && obj1.right > obj2.left && obj1.top < obj2.bottom && obj1.bottom > obj2.top && mode === 'left') {

            return true
        } else if (obj1.left < obj2.right && obj1.right > obj2.right && obj1.top < obj2.bottom && obj1.bottom > obj2.top && mode === 'right') {

            return true
        } else {
            return false
        }

    }

    function touchground() {


        if ((player1.y + player1.height) > ground.y) {
            player1.y = ground.y - player1.height + 0.1
            player1.spdY = 0
        }


        if (collide(player1, ground, 'all') === true) {
            player1.onGround = 1
            player1.jumps = player1.maxJumps
            player1.slam = 1

        } else if (collide(player1, ground, 'all') === false) {
            player1.onGround = 0
            gavitiy(player1)
        }

        //---------------//
        if ((player2.y + player2.height) > ground.y) {
            player2.y = ground.y - player2.height + 0.1
            player2.spdY = 0
        }


        if (collide(player2, ground, 'all') === true) {
            player2.onGround = 1
            player2.jumps = player2.maxJumps
            player2.slam = 1

        } else if (collide(player2, ground, 'all') === false) {
            player2.onGround = 0
            gavitiy(player2)
        }

        if (collide(enemy, ground, 'all') === true) {
            enemy.spdY = enemy.spdY * -1
        }

    }


    function gavitiy(playerobj) {

        if (playerobj.onGround === 0) {
            playerobj.spdY = playerobj.spdY + 0.2
        } else if (playerobj.onGround === 1) {
            playerobj.spdY = playerobj.spdY
        }
    }


    function collidePlatform(platform) {

        if (collide(player1, platform, 'bottom')) {
            player1.y = platform.y + platform.height + 1
            player1.spdY = player1.spdY * -1
        } else if (collide(player1, platform, 'left')) {
            player1.spdX = 0
        } else if (collide(player1, platform, 'right')) {
            player1.spdX = 0
        } else if (collide(player1, platform, 'top')) {
            player1.y = platform.y - player1.height + 0.1
            player1.spdY = 0
            player1.onGround = 1
            player1.jumps = player1.maxJumps
        }

        if (collide(player2, platform, 'bottom')) {
            player2.y = platform.y + platform.height + 1
            player2.spdY = player2.spdY * -1
        } else if (collide(player2, platform, 'left')) {
            player2.spdX = 0
        } else if (collide(player2, platform, 'right')) {
            player2.spdX = 0
        } else if (collide(player2, platform, 'top')) {
            player2.y = platform.y - player2.height + 0.1
            player2.spdY = 0
            player2.onGround = 1
            player2.jumps = player2.maxJumps
        }

        if (collide(enemy, platform, 'top') === true) {
            enemy.spdY = enemy.spdY * -1

        } else if (collide(enemy, platform, 'bottom') === true) {
            enemy.spdY = enemy.spdY * -1

        } else if (collide(enemy, platform, 'left') === true) {
            enemy.spdX = enemy.spdX * -1

        } else if (collide(enemy, platform, 'right') === true) {
            enemy.spdX = enemy.spdX * -1
        }

    }


    function playerHit() {

        if (collide(player1, player2, 'left')) {
            player1.spdX = -10
            player2.spdX = 10
        } else if (collide(player1, player2, 'right')) {
            player1.spdX = 10
            player2.spdX = -10
        } else if (collide(player1, player2, 'top')) {
            player1.spdY = -10
            player2.spdY = 10
        } else if (collide(player1, player2, 'bottom')) {
            player1.spdY = 10
            player2.spdY = -10
        }

        if (collide(player1, enemy, 'left')) {
            var damage = Math.random() * enemy.maxDamage
            if (damage < enemy.minDamage) {
                damage = enemy.minDamage
            }
            player1.hp = player1.hp - damage
            player1.spdX = -20
        } else if (collide(player1, enemy, 'right')) {
            var damage = Math.random() * enemy.maxDamage
            if (damage < enemy.minDamage) {
                damage = enemy.minDamage
            }
            player1.hp = player1.hp - damage
            player1.spdX = 20
        } else if (collide(player1, enemy, 'top')) {

            if (player1.slam === 0) {

                enemy.hp = enemy.hp - player1.damage
                player1.damage = 0
            } else if (player1.slam === 1) {
                var damage = Math.random() * enemy.maxDamage
                if (damage < enemy.minDamage) {
                    damage = enemy.minDamage
                }
                player1.hp = player1.hp - (damage/2)
                enemy.hp = enemy.hp - player1.damage
                player1.damage = 0
            }
            player1.spdY = -20
        } else if (collide(player1, enemy, 'bottom')) {
            var damage = Math.random() * enemy.maxDamage
            if (damage < enemy.minDamage) {
                damage = enemy.minDamage
            }
            player1.hp = player1.hp - damage
            player1.spdY = 20
        }

        if (collide(player2, enemy, 'left')) {
            var damage = Math.random() * enemy.maxDamage
            if (damage < enemy.minDamage) {
                damage = enemy.minDamage
            }
            player2.hp = player2.hp - damage
            player2.spdX = -20
        } else if (collide(player2, enemy, 'right')) {
            var damage = Math.random() * enemy.maxDamage
            if (damage < enemy.minDamage) {
                damage = enemy.minDamage
            }
            player2.hp = player2.hp - damage
            player2.spdX = 20
        } else if (collide(player2, enemy, 'top')) {
            if (player2.slam === 0) {

                enemy.hp = enemy.hp - player2.damage
                player2.damage = 0
            } else if (player2.slam === 1) {
                var damage = Math.random() * enemy.maxDamage
                if (damage < enemy.minDamage) {
                    damage = enemy.minDamage
                }
                player2.hp = player2.hp - (damage/2)
                enemy.hp = enemy.hp - player2.damage
                player2.damage = 0
            }
            player2.spdY = -20
        } else if (collide(player2, enemy, 'bottom')) {
            var damage = Math.random() * enemy.maxDamage
            if (damage < enemy.minDamage) {
                damage = enemy.minDamage
            }
            player2.hp = player2.hp - damage
            player2.spdY = 20
        }


    }

    function playerGainDmg(playerObj) {

        if (collide(playerObj, ground, 'all') === true) {
            if (playerObj.damage < playerObj.maxDamage) {
                playerObj.damage = playerObj.damage + playerObj.dmgRate
            }

        }

        if (playerObj.onGround === 1) {
            if (playerObj.damage < playerObj.maxDamage) {
                playerObj.damage = playerObj.damage + playerObj.dmgRate
            }

        }

    }

    function playerRegen(playerObj) {
        if (playerObj.onGround === 1 && playerObj.hp < playerObj.maxHP && playerObj.spdX === 0) {
            playerObj.hp = playerObj.hp + playerObj.regen
 
        }

        if(playerObj.hp <= 0){
            playerObj.hp = 0
        }
    }



    function endGame() {
        // stop the interval timer
        clearInterval(interval);

        // turn off event handlers
        $(document).off();
    }
}