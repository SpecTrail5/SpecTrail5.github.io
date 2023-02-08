// TODO 4: Add a parameter for your gaming library in the index.js module:
(function(window, createjs, opspark) {
  // OUR MODULE CODE GOES BELOW HERE //

  console.log('index.js initialized!');
  
  /*
   * In this project, we'll use our getDistance() method to 
   * determine if the mouse is intersecting with a Shape.
   *
   * If the mouse hovers-over the shape, we'll change the color 
   * of the Shape from blue to red.  We'll actually draw two 
   * circles, one blue and one red. The blue circle will sit on 
   * top of the red circle, and when the mouse intersects, we'll 
   * simply hide the blue circle by changing its 'alpha' property
   * from 1 to 0. Alpha is the transparency of the Display Object.
   */

  const
    // setup the standard demo 
    engine = opspark.V6().activateResize(),
    canvas = engine.getCanvas(),
    stage = engine.getStage(),
    
    
    radius = 25, // the radius of our two circles
    shapeUp = new createjs.Shape(), // the up state: the mouse is NOT intersecting
    shapeOver = new createjs.Shape(); // the over state: the mouse IS intersecting

  /*
   * Draw two circles, up for when the mouse is not touching it, over
   * for when the mouse is touching it. Note, the createjs API for drawing
   * is somewhat verbouse - it takes a lot of code just to draw a circle.
   */
  shapeUp.graphics.beginFill('blue').drawCircle(0, 0, radius);
  shapeOver.graphics.beginFill('red').drawCircle(0, 0, radius);
  shapeOver.alpha = 0;
  shapeUp.x = shapeOver.x = canvas.width / 2;
  shapeUp.y = shapeOver.y = canvas.height / 2;

  /*
   * Create a textfield - position it horizontally centered, and  
   * vertically just below center by 50px, so it sits below our circle shapes.
   */
  const
    textfield = new createjs.Text('Distance: ', "20px Arial", "#BBB"),
    textBounds = textfield.getBounds();
    
  textfield.x = (canvas.width - textBounds.width) / 2;
  textfield.y = canvas.height / 2 + 50;
  
  stage.addChild(shapeUp, shapeOver, textfield);
  
  // The update() method is called 60 times a second //
  function update(event) {
    /*
     * TODO 5: use getDistance to calculate the distance between shapeUp and 
     * the mouse. Store the result in a variable called distance:
     */
    
    
    
    /*
     * TODO 6: Check if the mouse is within the area of shapeUp, and set the 
     * alpha property of shapeUp accordingly:
     */
    
    
    /*
     * Update the textfield with the current distance between the mouse and 
     *the edge of the shapeUp
     */
    updateText(textfield, `Distance: ${Math.round(distance)}px`);
  }
  
  
  // this method updates the text on a textfield, then re-centers the textfield //
  function updateText(textfield, text) {
    textfield.text = text;
    const textBounds = textfield.getBounds();
    
    // re-center the text each time it changes //
    textfield.x = (canvas.width - textBounds.width) / 2;
    textfield.y = canvas.height / 2 + 50;
  }

  function getDistance(pointA, pointB) {
    const
      distanceX = pointB.x - pointA.x,
      distanceY = pointB.y - pointA.y,
      distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    return distance;
  }

  // startup the engine (the tick) //
  engine
    .addTickHandlers(update)
    .activateTick();

  // OUR MODULE CODE GOES ABOVE HERE //
  
// TODO 3: Pass your gaming library into the index.js module:
}(window, window.createjs, window.opspark));
