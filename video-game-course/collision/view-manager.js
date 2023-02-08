(function(window, opspark, _) {
  // create a namespace for the view manager //
  _.set(opspark, 'viewManager',
    /**
     * Creates and returns the view manager.
     * @param {Stage} stage: The CreateJS Stage Object.
     * @param {Object} messenger: The system wide event dispatcher.
     */
    function(stage, messenger) {
      messenger
        .on('SPAWN', event => stage.addChild(...event.bodies));
        
      messenger
        .on('DESPAWN', event => stage.removeChild(...event.bodies));
        
      return {
        
      };
    });
}(window, window.opspark, window._));
