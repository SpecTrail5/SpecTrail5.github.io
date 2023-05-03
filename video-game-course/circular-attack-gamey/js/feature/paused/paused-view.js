(function(opspark, createjs, draw, _) {
  const
    button = opspark.factory.component.button,
    layout = opspark.factory.component.layout;

  // create a namespace for the paused view //
  _.set(opspark, 'playa.paused', 
  /**
   * Creates and returns the paused view.
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
      menu = opspark.factory.menu(game),
      textfield = draw.textfield('PAUSED', 'bold 60px Arial', '#FFF');
    
    // add all view components to the view container //
    asset.addChild(menu.asset, textfield);


    /**
     * Called when the asset is added to the stage.
     * Use render() to config and position components.
     */
    function render() {
      textfield.alpha = 0;
      textfield.x = canvas.width / 2;
      textfield.y = 10;
    }
    
    // called on screen resize //
    function liquify() {
      return createjs.Tween.get(textfield, { loop: false })
          .to({ x: canvas.width / 2 }, 700, createjs.Ease.getPowInOut(4));
    }

    // setup a one-time added-to-parent listener //
    asset.on('added', onAdded);
    function onAdded(event) {
      if(game.getDebug()) console.log('paused view added to stage');
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
        createjs.Tween.get(textfield, { loop: false })
          .to({ alpha: 1 }, 500, createjs.Ease.getPowInOut(4));
        // just return the last tween //
        return menu.open();
      },
      close() {
        createjs.Tween.get(textfield, { loop: false })
          .to({ alpha: 0 }, 50, createjs.Ease.getPowInOut(4));
        // just return the last tween //
        return menu.close();
      }
    };
  });
}(window.opspark, window.createjs, window.opspark.draw, window._));
