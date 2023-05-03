(function(opspark, createjs, draw, _) {
  const
    button = opspark.factory.component.button,
    layout = opspark.factory.component.layout;
    
  // create a namespace for the playing view //
  _.set(opspark, 'playa.playing', 
  /**
   * Creates and returns the playing view.
   */
  function(game) {
    const
      canvas = game.canvas,
      
      /*
       * The container is the parent Container for this view. 
       * Use container.addChild() to add child components to the view.
       */
      container = new createjs.Container();
      
    // create view components here //
    const textfield = draw.textfield('PLAYING', 'bold 60px Arial', '#DDD');
    
    // add all view components to the view container //
    container.addChild(textfield);
    
    
    /**
     * Called when the container is added to the stage.
     * Use render() to config and position components.
     */
    function render() {
      canvas.style.backgroundColor = '#FFF';
      
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
    container.on('added', onAdded);
    function onAdded(event) {
      if(game.getDebug()) console.log('playing view added to stage');
      container.off('added', onAdded);
      render();
    }

    /*
     * Return the view API: It MUST expose the asset, the render() method, and 
     * the liquify() method. However, any other child components or API needed 
     * to control this view can be exposed.
     */
    return {
      container,
      render,
      liquify,
      open() {
        return createjs.Tween.get(textfield, { loop: false })
          .to({ alpha: 1 }, 500, createjs.Ease.getPowInOut(4))
          .wait(1500)
          .to({ alpha: 0 }, 500, createjs.Ease.getPowInOut(4));
      },
      close() {
        return createjs.Tween.get(textfield, { loop: false })
          .to({ alpha: 0 }, 50, createjs.Ease.getPowInOut(4));
      },
    };

  });
}(window.opspark, window.createjs, window.opspark.draw, window._));