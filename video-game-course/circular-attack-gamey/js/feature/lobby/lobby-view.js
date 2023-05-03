(function(opspark, createjs, draw, _) {
  const
    button = opspark.factory.component.button,
    layout = opspark.factory.component.layout;

  // LOBBY VIEW //
  // create a namespace for the lobby //
  _.set(opspark, 'playa.lobby', 
  /**
   * Creates and returns the lobby view.
   */
  function(game) {
    const
      canvas = game.canvas,
      
      /*
       * asset is the parent Container for this view. Use
       * asset.addChild() to add child components to the view.
       */
      asset = new createjs.Container();
      
    // create view components here //
    const
      textfield = draw.textfield('LOBBY', 'bold 60px Arial', '#FFF', ),
      menu = opspark.factory.menu(game);
      
    // add all view components to the view container //
    asset.addChild(textfield, menu.asset);
      
      
    /**
     * Called when the asset is added to the stage.
     * Use render() to config and position components.
     */
    function render() {
      canvas.style.backgroundColor = '#EEE';
      
      textfield.alpha = 0;
      textfield.x = canvas.width / 2;
      textfield.y = 10;
    }
    
    // called on screen resize //
    function liquify() {
      return createjs.Tween.get(textfield, { loop: false })
          .to({ x: canvas.width / 2 }, 700, createjs.Ease.getPowInOut(4))
    }

    // setup a one-time added-to-parent listener //
    asset.on('added', onAdded);
    function onAdded(event) {
      if(game.getDebug()) console.log('lobby view added to stage');
      asset.off('added', onAdded);
      render();
    }

    /*
     * Return the view API: It MUST expose the asset, the render method, and 
     * the liquify method. However, any other child components or API needed 
     * to control this view can be exposed.
     */
    return {
      asset,
      render,
      liquify,
      menu,
      open() {
        return createjs.Tween.get(textfield, { loop: false })
          .to({ alpha: 1 }, 700, createjs.Ease.getPowInOut(4));
      },
      close() {
        return createjs.Tween.get(textfield, { loop: false })
          .to({ alpha: 0 }, 50, createjs.Ease.getPowInOut(4));
      },
    };
  });
}(window.opspark, window.createjs, window.opspark.draw, window._));
