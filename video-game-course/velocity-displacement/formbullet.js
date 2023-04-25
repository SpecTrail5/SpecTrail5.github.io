
(function (window, draw, idk) {

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

  window.opspark.assets = {

    makeBullet(color) {
      const
        radius = 10,
        bullet = draw.rect(radius, radius, color, null, null, -(radius + radius / 10), -(radius / 2));

      // continue to draw on the bullet Shape to create our design //
      draw.circle(radius + 3, color, null, null, null, null, bullet);
      draw.circle(radius, 'darkred', null, null, null, null, bullet);
      draw.polyStar(radius, 3, 0, 0, color, null, null, null, null, bullet);
      draw.circle(radius - 15, 'darkred', null, null, -5, null, bullet);

      // reset the radius, other non-radii drawing operations have overwritten it //
      bullet.radius = radius + 3;

      // rasterize the vector graphic, basically creating a bitmap //
      bullet.snapToPixel = true;
      bullet.cache(-radius - 10, -radius - 10, radius * 2 + 15, radius * 2 + 15);

      // TODO 6: Merge the bullet with your game libs makeBody()

      Object.assign(bullet, idk.phyz.makeBody('bullet'));

      // give the bullet a default propulsion //
      bullet.propulsion = 0.1;

      return bullet;
    },
    centerOnStage,
  };

}(window, window.opspark.draw, window.idk));