
(function (window, opspark, _) {
  const
    Proton = window.Proton;

  // create a namespace for the shotgun manager //
  _.set(opspark, 'playa.shotgun',
    /**
     * Creates and returns the shotgun manager.
     */
    function (assets, fx, messenger) {
      const
        active = [],
        objects = [],
        pool = {
          active,
          objects,

          get: function () {
            if (objects.length > 0) {
              return objects.pop();
            }
            return makeObject();
          },

          recycle: function (object) {
            messenger.dispatch({ type: 'POOL', bodies: [object], source: 'shotgun' });
            // remove object from the active Array //
            const i = active.indexOf(object);
            if (i > -1) {
              active.splice(i, 1);
            }

            // reset and pool the object off the stage //
            object.x = -(object.width);
            object.alpha = 1;
            object.scaleX = object.scaleY = 1;
            objects.push(object);
          }
        },
        shotgunManager = {
          getNumberActive() {
            return active.length;
          },
          spawn(number = 1) {
            const spawned = [];
            for (let i = 0; i < number; i++) {
              spawned.push(pool.get());
            }
            active.push(...spawned);
            messenger.dispatch({ type: 'SPAWN', bodies: spawned, source: 'shotgun' });
            return this;
          },
        };

      function makeObject() {
        const shotgun = assets.makeShotgun();
        shotgun.handleCollision = handleCollision;
        return shotgun;
      }


      function explode() {
        let i, id;

        ship.alpha = 0;

        // show the player explosion for a short period of time //
        i = 0;
        id = setInterval(function () {
          ship.explosion.emit({ x: shotgun.x, y: shotgun.y });
          if (i > 60) {
            window.clearInterval(id);
            shotgun.explosion.stop();
            emitter.destroy();
            messenger.dispatch({ type: 'DESPAWN', bodies: [shotgun], source: 'shotgun' });
          }
          i++;
        }, 17);
      }

      function handleCollision(impact, body) {
        // don't handle collisions between shotguns //
        if (body.type === this.type) return;

        if (body.type === 'ship') {
          console.log("ship hit");
          body.shotgunEnabled = true;
          //if (this.integrity <= 0) {
            fx
              .makeEmitter(2, 3, "rgba(214, 36, 84, 0.2)", null, [
                new Proton.RandomDrift(5, 0, .35)
              ])
              .emit({ x: this.x, y: this.y }, 0.5);
            pool.recycle(this);
            messenger.dispatch({ type: 'EXPLOSION', source: 'shotgun', target: this, incoming: body });
          //}
        }

        /*
         * Because the explosion is async, the shotgun may exist
         * but have already exploded, so check first to see 
         * if it has integrity before running check to exlode.
         */
        if (this.integrity > 0) {
          console.log(impact);
          this.integrity -= impact;
          
        }
      }

      // return shotgun manager api //
      return shotgunManager;
    }
  );

}(window, window.opspark, window._));