// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads and is where you should call your functions.
$(document).ready(function () {
    const $display = $('#display');

    // Multiple TODOs: Call your apply function(s) here

    applyFilterNoBackground(reddify)
    applyFilterNoBackground(decreaseBlue)
    applyFilterNoBackground(increaseGreenByBlue)


    render($display, image);
});

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO 1, 2 & 4: Create the applyFilter function here
function applyFilter(filterFunction) {
    for (var i = 0; i < image.length; i++) {

        for (var j = 0; j < image[i].length; j++) {

            var rgbString = image[i][j]
            var rgbNumbers = rgbStringToArray(rgbString)

            filterFunction(rgbNumbers)

            rgbString = rgbArrayToString(rgbNumbers);
            image[i][j] = rgbString
        }

    }

}


// TODO 7: Create the applyFilterNoBackground function
function applyFilterNoBackground(filterFunc) {
    // cornerPixel
    var cornPix = image[0][0]

    for (var r = 0; r < image.length; r++) {

        for (var l = 0; l < image[r].length; l++) {

            if (image[r][l] !== cornPix) {

                var rgbStr = image[r][l]
                var rgbNums = rgbStringToArray(rgbStr)

                filterFunc(rgbNums)

                rgbStr = rgbArrayToString(rgbNums);
                image[r][l] = rgbStr

            }

        }

    }
}
// TODO 5: Create the keepInBounds function
function keepInBounds(bound) {
    return Math.max(0, Math.min(255, bound))

}


// TODO 3: Create reddify function
function reddify(Rcolor) {
    Rcolor[RED] = Math.random() * 255

}

// TODO 6: Create more filter functions
function decreaseBlue(Bcolor) {
    Bcolor[BLUE] = keepInBounds(Bcolor[BLUE] - 50)

}

function increaseGreenByBlue(Gcolor) {
    Gcolor[GREEN] = keepInBounds(Gcolor[GREEN] + Gcolor[BLUE])

}

// CHALLENGE code goes below here
