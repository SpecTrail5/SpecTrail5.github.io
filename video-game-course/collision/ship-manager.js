(function(window, opspark, _) {
  // create a namespace for the ship manager //
  _.set(opspark, 'shipManager',
    /**
     * Creates and returns the ship manager.
     * @param {Object} assets: The factory API for creating assets, 
     * must expose makeShip().
     * @param {Object} controls: The system wide instance of controlFreak.
     * @param {Object} messenger: The system wide event dispatcher.
     * @param {Object} [keyMap]: An optional map of keys to control
     * the ships propulsion and left and right rotation. The key map
     * can also be set using setKeyMap().
     */
    function(assets, controls, messenger, keyMap) {
      // default key map //
      keyMap = keyMap || {
        UP: controls.KEYS.UP,
        LEFT: controls.KEYS.LEFT,
        RIGHT: controls.KEYS.RIGHT,
      }
        
      let ship;

      return {
        spawn(color = '#4286f4') {
          if(ship) throw new Error('Ship is already spawned!');
          ship = assets.makeShip(color);
          messenger.dispatch({type: 'SPAWN', bodies: [ship]});
          return this;
        },
        setKeyMap(map) {
          keyMap = map;
          return this;
        },
        update(event) {
          // left and right arrows cannot be pressed at the same time //
          if (controls.isActive(keyMap.LEFT)) {
            ship.rotationalVelocity = -5;
          } else if (controls.isActive(keyMap.RIGHT)) {
            ship.rotationalVelocity = 5;
          } else {
            ship.rotationalVelocity = 0;
          }

          // up arrow can be pressed in combo with other keys //
          if (controls.isActive(keyMap.UP)) {
            ship.propulsion = 0.1;
          } else {
            ship.propulsion = 0;
          }
        },
      };
    });
}(window, window.opspark, window._));
