(function(window, draw, racket) {

  function centerOnStage(asset, canvas) {
    if (asset.type === 'circular' || asset.radius) {
      asset.x = canvas.width / 2;
      asset.y = canvas.height / 2;
    } else {
      const bounds = asset.getBounds();
      asset.x = (canvas.width - bounds.width) / 2;
      asset.y = (canvas.height - bounds.width) / 2;
    }
  }

  /**
   * Creates an API at opspark.assets to 
   * build and work with visual assets.
   * 
   * @param {Object} canvas: The canvas on which the 
   * game is drawn, used for incept positioning of assets.
   */
  window.opspark.assets = function(canvas) {
    // ASSET BEHAVIORS //
    function updateShip(event) {
      racket.physikz.updateVelocity(this, this.propulsion, this.propulsion);
      racket.physikz.reboundCircularAssetInArea(this, canvas);
    };
    
    function updateOrb(event) {
      racket.physikz.updateVelocity(this, 0, 0);
      racket.physikz.reboundCircularAssetInArea(this, canvas);
    }

    return {
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
        Object.assign(ship, racket.physikz.makeBody('ship'));

        // give the ship a default propulsion //
        ship.propulsion = 0;

        // set a random rotation value //
        ship.rotation = racket.num.randomIntBetween(0, 359);
        
        // set the update behavior for the ship //
        ship.update = updateShip;
        
        // default position to center of stage //
        ship.x = racket.num.randomIntBetween(0, canvas.width);
        ship.y = racket.num.randomIntBetween(0, canvas.height);
        
        return ship;
      },
      makeOrb() {
        const orb = draw.randomCircleInArea(canvas, false, true, '#999', 2);
        Object.assign(orb, racket.physikz.makeBody('orb'));
        racket.physikz.addRandomVelocity(orb, canvas);
        orb.update = updateOrb;
        return orb;
      },
      centerOnStage,
    };
  }
}(window, window.opspark.draw, window.opspark.racket));
