// TODO 4: Change *my-game-lib* to the name of your game lib
(function(window, opspark, *my-game-lib*) {
  const
    engine = opspark.V6().activateResize(),
    canvas = engine.getCanvas(),
    stage = engine.getStage(),
    assets = opspark.assets,
    space = opspark.space;

  const ship = assets.makeShip('#4286f4');

  /*
   * The space module expects each body to implement an
   * update() method. On each tick, the space module loops
   * through all bodies in its active Array, and will call 
   * each body's update() method. After this, the space module 
   * will update body's position. This allows each body to
   * have its own custom approach to updating its velocity.
   * 
   * The body's update() method must consider all forces 
   * acting on it.  In our case, the ship's propulsion is 
   * acting against it on both axis, x and y.
   */
  ship.update = function() {
    /*
     * TODO 7: Use your game lib's phyz.updateVelocity() 
     * method to update the ship's velocity. The 
     * updateVelocity() method takes two arguments,
     * the body being updated, and the forces acting 
     * against the body on its x and y axis.
     *
     * TIPS:
     * 1. The body is obviously the ship, and the ship 
     * is available to you in this scope as, "this".
     * 2. What are the x and y forces acting on our ship?
     */
    
    
    
    // also check if the ship needs to rebound off a boundary //
    reboundCircularAssetInArea(this, canvas);
  };

  assets.centerOnStage(ship, canvas);
  stage.addChild(ship);

  // let the space module manage our ship //
  space.add(ship);

  engine
    .addTickHandlers(space.update)
    .activateTick();

  // listen for user pressing keys down //
  document.onkeydown = function(event) {
    /*
     * Up arrow can be pressed in combo with other keys.
     * propulsion of 0.1 is set when ArrowUp is pressed.
     */
    if (event.key === 'ArrowUp') {
      ship.propulsion = 0.1;
    }

    /*
     * Left and right arrows cannot be pressed at the 
     * same time. rotationalVelocity is set to -5 when
     * ArrowLeft is pressed, and 5 when its ArrowRight.
     */
    if (event.key === 'ArrowLeft') {
      ship.rotationalVelocity = -5;
    } else if (event.key === 'ArrowRight') {
      ship.rotationalVelocity = 5;
    }
  };

  // listen for user releasing keys //
  document.onkeyup = function(event) {
    // TODO 13: How do we stop the application of forces?
    
  };
  
  function reboundCircularAssetInArea(body, area) {
    const
      radius = body.radius,
      top = 0,
      left = 0,
      right = area.width,
      bottom = area.height;

    // check for hit on either side of area //
    if (body.x + radius > right) {
      // we've struck the right side of the area //
      body.x = right - radius;
      body.velocityX *= -1;
    } else if ( /* TODO 9: Check if body's hit left side */ false ) {
      // we've struck the left side of the area //
      // TODO 10: Code the reaction to hitting the left side
      
    }

    // check for hit on top or bottom //
    if (body.y - radius < top) {
      // we've struck the right side of the area //
      body.y = top + radius;
      body.velocityY *= -1;
    } else if ( /* TODO 11: Check if body's hit bottom */ false ) {
      // we've struck the bottom of the area //
      // TODO 12: Code the reaction to hitting the bottom
      
    }
  }
  
  // TODO 3: replace *my-game-lib* with the name of your game lib //
}(window, window.opspark, window.*my-game-lib*));
