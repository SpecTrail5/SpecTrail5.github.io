(function(window, opspark, _) {
  // create a namespace for the view manager //
  _.set(opspark, 'playa.viewManager',
    /**
     * Creates and returns the view manager.
     * 
     * Listens for the SPAWN AND DESPAWN events to add/remove 
     * DisplayObjects from the Container.
     * 
     * Call activate() to use, deactivate() to clean up 
     * messenger listeners.
     * 
     * @param {Container} view: A CreateJS Container onto which 
     * DisplayObjects will be added/removed.
     * @param {Object} messenger: The system wide event dispatcher.
     */
    function(view, messenger) {
      function onSpawn(event) {
        view.addChild(...event.bodies);
      }
      
      function onDespawn(event) {
        view.removeChild(...event.bodies);
      }
      
      return {
        activate() {
          messenger.on('SPAWN', onSpawn);
          messenger.on('DESPAWN', onDespawn);
          return this;
        },
        deactivate() {
          messenger.off('SPAWN', onSpawn);
          messenger.off('DESPAWN', onSpawn);
          return this;
        },
      };
    });
}(window, window.opspark, window._));
