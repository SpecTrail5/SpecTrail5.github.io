(function(opspark, _) {
  // create a namespace for the initializingMediator //
  _.set(opspark, 'playa.initializingMediator', 
  /**
   * Creates and returns the initializing mediator.
   */
  function(view, game, data) {
    /*
     * Return the mediator API: Each mediator must expose its view,
     * a liquify() method used for repositioning components on screen 
     * resize, a destroy() method used to clean up any references, and 
     * methods enter(), exit(), which must return a Promise that 
     * resolves when the enter or exit sequence is complete.
     */
    return {
      view,
      liquify() {
        return view.liquify();
      },
      enter() {
        return new Promise(function(resolve, reject) {
          game.view.addChild(view.asset);
          view.open();
          
          // load the game data //
          opspark.util.getJSON('data.json', (data) => {
            view.close()
              .call(() => resolve(data));
          });
          
        });
      },
      exit() {
        return new Promise(function(resolve, reject) {
          
          resolve();
        });
      },
      destroy() {
        game.view.removeChild(view.asset);
      }
    };

  });
}(window.opspark, window._));
