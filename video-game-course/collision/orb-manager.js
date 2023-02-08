(function(window, opspark, _) {
  const
    draw = opspark.draw,
    physikz = window.opspark.racket.physikz;

  // create a namespace for the orbManager //
  _.set(opspark, 'orbManager',
    /**
     * Creates and returns the orb manager. To create orbs, call spawn().
     * @param {Object} assets: The factory API for creating assets, 
     * must expose makeOrb().
     * @param {Object} messenger: The system wide event dispatcher.
     */
    function(assets, messenger) {
      const
        active = [],
        objects = [],
        pool = {
          active,
          objects,

          get: function() {
            if (objects.length > 0) {
              return objects.pop();
            }
            return makeObject();
          },

          recycle: function(object) {
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
        };

      function makeObject() {
        return assets.makeOrb();
      }
      
      // return orb manager api //
      return {
        spawn(number = 1) {
          const spawned = [];
          for (let i = 0; i < number; i++) {
            spawned.push(pool.get());
          }
          messenger.dispatch({ type: 'SPAWN', bodies: spawned });
          return this;
        },
      };
    }
  );

}(window, window.opspark, window._));
