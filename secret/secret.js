

$("#die").on("click", rollDie)


function rollDie() {
    $('#die').empty();

    var randomNum = Math.ceil(Math.random() * 6)

    console.log(randomNum)

    if (randomNum === 1) {
        makeDot(40, 40);
    }
    else if (randomNum === 2) {
        makeDot(10, 10);
        makeDot(70, 70);
    }
    else if (randomNum === 3) {
        makeDot(10, 10);
        makeDot(40, 40);
        makeDot(70, 70);
    }
    else if (randomNum === 4) {
        makeDot(10, 10);
        makeDot(70, 70);
        makeDot(70, 10);
        makeDot(10, 70);
    }
    else if (randomNum === 5) {
        makeDot(10, 10);
        makeDot(70, 70);
        makeDot(40, 40);
        makeDot(70, 10);
        makeDot(10, 70);
    }
    else if (randomNum === 6) {
        makeDot(10, 10);
        makeDot(10, 40);
        makeDot(70, 70);
        makeDot(70, 10);
        makeDot(70, 40);
        makeDot(10, 70);
    }
}

function makeDot(dotX, dotY) {


    $('<div>')
        .addClass("pip")
        .css("height", 20)
        .css("width", 20)
        .css("border-radius", 50)
        .css("background-color", "black")
        .css("position", "absolute")
        .css('top', dotY)
        .css('left', dotX)
        .appendTo("#die");

}


$("#die").hover(function () {
    $(this).css("outline-color", "red");
})
