// TODO 5.b: Replace *my-game-lib* with the name of your game lib
(function(window, draw, *my-game-lib*) {
  
  function centerOnStage(asset, canvas) {
    if(asset.type === 'circular' || asset.radius) {
      asset.x = canvas.width / 2;
      asset.y = canvas.height / 2;
    } else {
      const bounds = asset.getBounds();
      asset.x = (canvas.width - bounds.width) / 2;
      asset.y = (canvas.height - bounds.width) / 2;
    }
  }

  /*
   * Creates an API at opspark.assets to 
   * build and work with visual assets.
   */
  window.opspark.assets = {
    makeShip(color) {
      const
        radius = 25,
        ship = draw.rect(radius, radius, color, null, null, -(radius + radius / 10), -(radius / 2));

      // continue to draw on the ship Shape to create our design //
      draw.circle(radius + 3, color, null, null, null, null, ship);
      draw.circle(radius, '#CCC', null, null, null, null, ship);
      draw.polyStar(radius, 3, 0, 0, color, null, null, null, null, ship);
      draw.circle(radius - 15, '#CCC', null, null, -5, null, ship);

      // reset the radius, other non-radii drawing operations have overwritten it //
      ship.radius = radius + 3;

      // rasterize the vector graphic, basically creating a bitmap //
      ship.snapToPixel = true;
      ship.cache(-radius - 10, -radius - 10, radius * 2 + 15, radius * 2 + 15);
      
      // TODO 6: Merge the ship with your game libs makeBody()
      
      
      
      // give the ship a default propulsion //
      ship.propulsion = 0;
      
      return ship;
    },
    centerOnStage,
  };
// TODO 5.a: Replace *my-game-lib* with the name of your game lib
}(window, window.opspark.draw, window.*my-game-lib*));
