
(function(window, opspark, _) {
  const
    Proton = window.Proton;


var shotgun = {
  id: '#shotgun',
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  speedX: 0,
  speedY: 0
}

function makeObject() {

  var board = document.getElementById('canvas')

  var shotgunObj = document.createElement('shotgun')

  shotgunObj.id = 'shotgun'

board.appendChild(shotgunObj)



}

makeObject()

function moveObject(obj) {
  obj.x += obj.speedX;
  obj.y += obj.speedY;

  $(obj.id).css('left', obj.x)
  $(obj.id).css('top', obj.y)

}
}(window, window.opspark, window._));