(function(opspark, createjs, draw, _) {
  const
    button = opspark.factory.component.button,
    layout = opspark.factory.component.layout;
  
  // MENU //
  // create a namespace for the menu //
  _.set(opspark, 'factory.menu', 
  /**
   * Creates and returns the menu view.
   */
  function(game) {
    const
      canvas = game.canvas,
      width = 293,
      asset = new createjs.Container(),
      btnPlay = button('PLAY'),
      btnSettings = button('SETTINGS'),
      btnQuit = button('QUIT', '#d9534f', '#d43f3a', true);
    
    function render() {
      asset.x = -width - 10;
      asset.y = 10;
      
      // roundRect: function (width, height, radius, color, strokeColor, strokeStyle, xOffset, yOffset, onShape) {
      const
        background = draw.roundRect(
          width,
          canvas.height - 20,
          4,
          '#FFF',
          '#CCC',
          1);
      asset.addChild(background);

      const controls = layout({children: [btnPlay, btnSettings]});
      asset.addChild(controls);
      
      if(game.getStateName() === 'paused') {
        btnQuit.x = 10;
        btnQuit.y = background.height - btnQuit.getBounds().height - 10;
        asset.addChild(btnQuit);
      }
      
      game.stage.update();
    }

    asset.on('added', onAdded);
    function onAdded() {
      asset.off('added', onAdded);
      console.log('menu view added to stage');
      render();
    }

    return {
      asset,
      render,
      btnPlay,
      btnSettings,
      btnQuit,
      open() {
        return createjs.Tween.get(asset, { loop: false })
          .to({ x: 10, alpha: 1 }, 700, createjs.Ease.getPowInOut(4));
      },
      close() {
        return createjs.Tween.get(asset, { loop: false })
          .to({ x: -width - 10, alpha: 1 }, 400, createjs.Ease.getPowInOut(4));
      },
    };
  });
}(window.opspark, window.createjs, window.opspark.draw, window._));
