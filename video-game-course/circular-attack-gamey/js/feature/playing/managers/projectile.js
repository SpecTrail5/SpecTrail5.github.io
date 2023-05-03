(function(window, opspark, _) {
  const
    createjs = window.createjs,
    draw = opspark.draw,
    phyz = opspark.racket.physikz;

  // create a namespace for the projectile manager //
  _.set(opspark, 'playa.projectile',
    /**
     * Creates and returns the projectile manager.
     */
    function(fx, assets, messenger) {
      const
        objects = [],
        pool = {
          objects: objects,

          get: function() {
            if (objects.length > 0) {
              return objects.pop();
            }
            return makeObject();
          },

          recycle: function(object) {
            messenger.dispatch({ type: 'POOL', bodies: [object] });
            
            object.x = -(object.width);
            object.alpha = 1;
            object.scaleX = object.scaleY = 1;
            objects.push(object);
          }
        };

      function makeObject() {
        return assets.makeProjectile();
      }
      
      function handleCollisionProjectile(impact) {
        // TODO : Consider if particles are necessary here //
        // particleManager.makeEmitter(1, 2, '#FF0000').emit({x: projectile.x, y: projectile.y}, 0.5);
      }

      function onTweenComplete(e) {
        pool.recycle(e.target);
      }

      // return the projectile manager api //
      return {
        fire: function(emitter) {
          var projectile, degrees;
          
          projectile = pool.get();
          projectile.rotation = emitter.rotation;
          
          //console.log(projectile.rotation);
          
          degrees = emitter.rotation;
          projectile.velocityX = Math.cos(phyz.degreesToRadians(degrees)) * (projectile.velocityMax + emitter.velocityX);
          projectile.velocityY = Math.sin(phyz.degreesToRadians(degrees)) * (projectile.velocityMax + emitter.velocityY);
          projectile.rotationalVelocity = 0;
          
          //console.log(projectile.velocityX);
          //console.log(projectile.velocityY);

          var projectilePoint = emitter.getProjectilePoint();
          //projectile.activate();
          projectile.x = projectilePoint.x;
          projectile.y = projectilePoint.y;
          
          // keep a reference on the projectile to who shot the projectile //
          projectile.emitter = emitter;

          createjs.Tween.get(projectile, { override: true })
            .wait(500)
            .to({ alpha: 0, scaleX: 0.1, scaleY: 0.1 }, 1000, createjs.Ease.linear)
            .call(onTweenComplete);

          messenger.dispatch({ type: 'SPAWN', bodies: [projectile] });
        }
      };
    });
}(window, window.opspark, window._));
