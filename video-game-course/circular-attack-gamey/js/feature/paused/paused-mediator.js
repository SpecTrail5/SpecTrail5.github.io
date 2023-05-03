(function(opspark, _) {
  // create a namespace for the pausedMediator //
  _.set(opspark, 'playa.pausedMediator', 
  /**
   * Creates and returns the paused mediator.
   */
  function(view, game, data) {
    
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && (String.fromCharCode(event.which).toLowerCase() === 'p')) {
        event.preventDefault();
        event.stopPropagation();
        window.removeEventListener('keydown', onKeyDown);
        game.play();
      }
    }
    
    function onPlayClicked(event) {
      view.menu.btnPlay.off('click', onPlayClicked);
      game.play();
    }
    
    function onSettingsClicked(event) {
      view.menu.btnSettings.off('click', onSettingsClicked);
      console.log('TODO: show settings');
      // showSettings();
    }
    
    function onQuitClicked(event) {
      view.menu.btnQuit.off('click', onQuitClicked);
      game.end();
    }
    
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
          view.menu.btnPlay.on('click', onPlayClicked);
          view.menu.btnQuit.on('click', onQuitClicked);
          view.menu.btnSettings.on('click', onSettingsClicked);
          window.addEventListener('keydown', onKeyDown);
          resolve();
        });
      },
      exit() {
        return new Promise(function(resolve, reject) {
          // call resolve() when the menu-close Tween ends //
          view.close().call(resolve);
        });
      },
      destroy() {
        window.removeEventListener('keydown', onKeyDown);
        view.menu.btnPlay.off('click', onPlayClicked);
        view.menu.btnSettings.off('click', onSettingsClicked);
        view.menu.btnQuit.off('click', onQuitClicked);
        game.view.removeChild(view.asset);
      }
    };
  });
}(window.opspark, window._));
