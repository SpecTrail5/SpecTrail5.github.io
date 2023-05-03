(function(opspark, _) {
  // create a namespace for the endMediator //
  _.set(opspark, 'playa.endMediator', 
  /**
   * Creates and returns the end mediator.
   */
  function(view, game, data) {
    
    function onLobbyClicked(event) {
      view.btnLobby.off('click', onLobbyClicked);
      game.lobby();
    }
    
    function onPlayClicked(event) {
      view.btnPlay.off('click', onPlayClicked);
      game.play();
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
        return new Promise(function(resove, reject) {
          game.view.addChild(view.asset);
          view.btnLobby.on('click', onLobbyClicked);
          view.btnPlay.on('click', onPlayClicked);
          view.setText(_.get(data, 'message') || 'Game Over');
          view.open();
          // don't wait for open animation to end to call resolve //
          resove();
        });
      },
      exit() {
        return new Promise(function(resove, reject) {
          view.close().call(resove);
        });
      },
      destroy() {
        view.btnLobby.off('click', onLobbyClicked);
        view.btnPlay.off('click', onPlayClicked);
        game.view.removeChild(view.asset);
      }
    };

  }
  );
}(window.opspark, window._));
