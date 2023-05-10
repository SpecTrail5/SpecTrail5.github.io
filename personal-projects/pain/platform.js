function createPlatForm(x, y, width, height) {

    const box = document.createElement('div')

    box.setAttribute('id', 'platform');

    box.style.background = 'linear-gradient( gray,black)'
    box.style.background = 'url(image/wall.png) repeat-x'
    box.style.backgroundSize = '200px 110px'
    box.style.borderTop = ' 5px inset steelblue'
    box.style.boxShadow = '0px 10px 10px -5px black'
    box.style.width = width + 'px';
    box.style.height = height + 'px';
    box.style.position = 'relative';
    box.style.left = x + 'px'
    box.style.top = y + 'px'



    const con = document.getElementById('board')

    con.appendChild(box)

}