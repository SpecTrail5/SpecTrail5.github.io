(function(opspark, _) {
  // create a namespace for the playingMediator //
  _.set(opspark, 'playa.playingMediator',
    /**
     * Creates and returns the playing mediator.
     */
    function(view, game, data) {
      const
        level = data.levels[data.currentLevel],
        canvas = game.canvas,
        controls = opspark.controlFreak(),
        messenger = opspark.factory.dispatcher(),
        viewManager = opspark.playa.viewManager(view.container, messenger).activate(),
        fx = opspark.playa.fx(game, view.container),
        assets = opspark.playa.assets(canvas, fx, level),
        hud = opspark.playa.hud(game, messenger).activate(),
        space = opspark.playa.space(messenger, level),
        
        ship = opspark.playa.ship(
          assets, 
          controls, 
          messenger, 
          opspark.playa.projectile(fx, assets, messenger),
          fx.makePlayerEmitter(), 
          level)
          .spawn(),
          
        shipTwo = opspark.playa.ship(
          assets, 
          controls, 
          messenger, 
          opspark.playa.projectile(fx, assets, messenger),
          fx.makePlayerEmitter(), 
          level)
          .setKeyMap({ UP: controls.KEYS.W, LEFT: controls.KEYS.A, RIGHT: controls.KEYS.D, FIRE: controls.KEYS.SHIFT_LEFT })
          .spawn('#f44242'),
          
        orb = opspark.playa.orb(assets, fx, messenger)
          .spawn(25);
      
      game.view.addChild(view.container);
      
      // event handlers here //
      
      function onExplosion(event) {
        switch(event.source) {
          case 'ship':
            messenger.off('EXPLOSION', onExplosion);
            setTimeout(() => game.end({message: "GAME OVER"}), 2000);
            break;
          case 'orb':
            if(orb.getNumberActive() < 1) {
              messenger.off('EXPLOSION', onExplosion);
              setTimeout(() => game.end({message: "HOT THING"}), 2000);
            }
            break;
        }
      }
      
      // handle pause key stroke //
      function onKeyDown(event) {
        if ((event.metaKey || event.ctrlKey) && (String.fromCharCode(event.which).toLowerCase() === 'p')) {
          event.preventDefault();
          event.stopPropagation();
          window.removeEventListener('keydown', onKeyDown);
          game.pause();
        }
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
          hud.liquify();
          return view.liquify();
        },
        enter() {
          return new Promise(function(resove, reject) {
            game.stage.enableMouseOver(0);
            window.addEventListener('keydown', onKeyDown);
            
            view.open();
            
            controls.activate();
            hud.activate();

            game.addUpdateable(fx, ship, shipTwo, space);
            
            // orbManager.on('EXPLOSION', onOrbExplosion);
            messenger.on('EXPLOSION', onExplosion);
            
            resove();
          });
        },
        exit() {
          return new Promise(function(resove, reject) {
            view.close();
            
            controls.deactivate();
            hud.deactivate();
            
            game.removeUpdateable(space, ship, shipTwo, fx);
            game.stage.enableMouseOver(20);
            resove();
          });
        },
        destroy() {
          window.removeEventListener('keydown', onKeyDown);
          messenger.clearHandlers();
          
          hud.destroy();
          controls.deactivate();
          viewManager.deactivate();
          
          // orbManager.off('EXPLOSION', onOrbExplosion);
          // playerManager.off('EXPLOSION', onPlayerExplosion);
          
          game.view.removeChild(view.container);
        }
      };
    });
}(window.opspark, window._));
