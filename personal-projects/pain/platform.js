function createPlatForm(x, y, width, height) {

    const box = document.createElement('div')

    box.setAttribute('id', 'platform');

    box.style.backgroundColor = 'dimgray'
    box.style.width = width + 'px';
    box.style.height = height + 'px';
    box.style.position = 'relative';
    box.style.left = x + 'px'
    box.style.top = y + 'px'



    const con = document.getElementById('board')

    con.appendChild(box)

}