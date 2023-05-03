(function(window, createjs, _) {
  // use the opspark namespace //
  const opspark = _.set(window, 'opspark', window.opspark || {}).opspark;
  
  // create the gamey.make namespace //
  _.set(opspark, 'gamey.make', 
  /**
   * Creates and returns the gamey app.
   */ 
  function(map, updateables = [], debug = true) {
    // if set to true, will log state transitions //
    let _debug = debug;
    
    if(_debug) console.log('gamey created');
    
    const app = {};

    /*
     * Used to hold the wrapper Function returned from
     * calling createjs.Ticker.on('tick', app.update);
     * Needed to remove the app.update method from the tick event.
     */
    let tickerHandler;
    
    /*
     * Holds the current state Object of the 
     * game, which is a state machine. Set the
     * initial state to incept, which can only
     * transition to the lobby state.
     */
    let _state = _.assign(makeState('incept', map), {
      lobby(data) {
        if(_debug) console.log('incept state calling lobby()...');
        return setState(states.lobby, data);
      },
      exit() {
        return Promise.resolve(true);
      },
    });
    
    /**
     * A dummy Function, used to override a state's transition method
     * when one state cannot transition to another. Returns a resolved
     * Promise.
     */
    function doNothing() { return Promise.resolve(true); }
    
    /**
     * A factory to create a state. An object oriented approach, each
     * state has the same API, but behaviour is overridden per state.
     */
    function makeState(name, map) {
      return {
        _name: name,
        map,
        
        /*
         * The set of transition methods shared by each state. If one
         * state cannot transition to another, the transition method
         * should be overridden with doNothing, a dummy Function.
         */
        lobby: doNothing,
        play: doNothing,
        pause: doNothing,
        end: doNothing,
        
        /*
         * Called from within setState, exit() is called on the current state.
         * Here we provide an implementation that most states will share.
         */
        exit(toState) {
          const
            mediators = this.map.mediators,
            mediator = mediators[this.getName()];
          return mediator.exit().then(() => {
            mediator.destroy(); 
            delete mediators[this.getName()];
            return true;
          });
        },
        
        /*
         * Called from within the state machine's setState(), 
         * enter() is called on the new state after it is set 
         * as the current state.
         */
        enter(data) { },
        
        /*
         * Called by the onResize() method, delegates liquifying behavior
         * to the state. Defaults to liquifying the feature mediator associated
         * with the current state. However, states that have multiple features 
         * open at once can override this behavior.
         */
        liquify() {
          map.mediators[name].liquify();
        },
        
        getName() { return name; },
      };
    }
    
    // NOTE: all enter() and exit() methods MUST return a Promise.
    const states = {
      lobby: _.assign(makeState('lobby', map), {
        enter(fromState, data) {
          if(_debug) console.log(`enter lobby from ${fromState.getName()}`);
          
          /*
           * Setup the Ticker to call app.update(), but make sure
           * we don't re-add the app.update handler. CreateJS returns
           * the app.update() method in a wrapped Function. It's this
           * wrapped Function we need to remove each time.
           */
          if(tickerHandler) createjs.Ticker.off('tick', tickerHandler);
          tickerHandler = createjs.Ticker.on('tick', app.update);
          if(_debug) console.log(`lobby safely setup app.update to handle tick`);
          
          return createAndRunEnterForMediator(app, this.map, 'lobby', data);
        },
        play(data) {
          /*
           * Transition first to the initializing state, 
           * the initializing state will transition to playing.
           */
          if(_debug) console.log('lobby state calling play()...');
          return setState(states.initializing, data);
        },
      }),
      
      initializing: _.assign(makeState('initializing', map), {
        enter(fromState, data) {
          if(_debug) console.log(`enter initializing from ${fromState.getName()}`);
          
          /*
           * Let the initializing state call its play() method to
           * automatically transition to the playing state once
           * the initManager is done with its enter sequence.
           *
           * NOTE: The initializing-mediator can resolve with a data Object, 
           * ie, initialized game assets or data, and it will be passed as 
           * the data Object to the factory of the playing-mediator.
           */
          return createAndRunEnterForMediator(app, this.map, 'initializing', data)
            .then((initializedData) => this.play(initializedData));
        },
        play(data) {
          if(_debug) console.log('initializing state calling play()...');
          
          // make sure we don't re-add the app.update handler //
          if(tickerHandler) createjs.Ticker.off('tick', tickerHandler);
          
          // but make sure the app.update handler is handling tick //
          tickerHandler = createjs.Ticker.on('tick', app.update);
          
          /*
           * Setup the game playing view here in the initializing state's
           * play() transition method, so that entering to the playing 
           * from the paused state doesn't recreate the game playing view.
           */
          return createAndRunEnterForMediator(app, this.map, 'playing', data)
            .then(() => setState(states.playing, data));
        },
      }),
      
      playing: _.assign(makeState('playing', map), {
        enter(fromState, data) {
          if(_debug) console.log(`enter playing from ${fromState.getName()}`);
          
          return Promise.resolve(true);
        },
        exit(toState) {
          /*
           * Don't destroy the game view/mediator when exiting the playing state, 
           * we'll just shut it down by calling the mangers's exit() method. Both 
           * pause and end states will place views on top of the playing view. The 
           * transition to the end state will call destroy on the playing feature.
           */
          return this.map.mediators[states.playing.getName()].exit();
        },
        pause(data) {
          if(_debug) console.log('playing state calling pause()...');
          
          return setState(states.paused, data);
        },
        end(data) {
          if(_debug) console.log('playing state calling end()...');
          return createAndRunEnterForMediator(app, this.map, 'end', data)
            .then(() => setState(states.end, data));
        },
      }),
      
      paused: _.assign(makeState('paused', map), {
        enter(fromState, data) {
          if(_debug) console.log(`enter paused from ${fromState.getName()}`);
          
          return createAndRunEnterForMediator(app, this.map, 'paused', data);
        },
        play(data) {
          if(_debug) console.log('paused state calling play()...');
          /*
           * Call enter on the playing mediator here, it is 
           * not called on enter() of the playing state.
           */
          return setState(states.playing, data)
            .then(() => this.map.mediators[states.playing.getName()].enter());
        },
        end(data) {
          if(_debug) console.log('paused state calling end()...');
          return createAndRunEnterForMediator(app, this.map, 'end', data)
            .then(() => setState(states.end, data));
        },
        liquify() {
          const mediators = this.map.mediators;
          mediators[this._name].liquify();
          // the playing feature is open, so also liquify the playing mediator //
          mediators[states.playing.getName()].liquify();
        },
      }),
      
      end: _.assign(makeState('end', map), {
        enter(fromState, data) {
          if(_debug) console.log(`enter end from ${fromState.getName()}`);
          
          // pause playing assets, show stats or game over //
          
          /* 
           * Let the playing or paused states' end() transition
           * method create the end mediator and view.
           */
        },
        lobby(data) {
          if(_debug) console.log('end state calling lobby()...');
          return destroyPlayingFeatureAndGoToState(this.map, states.lobby, data); 
        },
        play(data) {
          /*
           * Transition first to the initializing state, 
           * the initializing state will transition to playing.
           */
          if(_debug) console.log('lobby state calling play()...');
          return destroyPlayingFeatureAndGoToState(this.map, states.initializing, data);
        },
        liquify() {
          const mediators = this.map.mediators;
          mediators[this._name].liquify();
          // the playing feature is open, so also liquify the playing mediator //
          mediators[states.playing.getName()].liquify();
        },
      }),
    };
    
    function destroyPlayingFeatureAndGoToState(map, toState, data) {
      const
        name = states.playing.getName(),
        playingManager = map.mediators[name];
      return playingManager.exit()
        .then(() => {
          playingManager.destroy(); 
          delete map.mediators[name];
          return setState(toState, data);
        });
    }
    
    function createAndRunEnterForMediator(app, map, feature, data) {
      const
        factories = map.factories,
        mediators = map.mediators,
        /*
         * Data is passed to the constructor of the mediator: can be used 
         * to make views/features more dynamic as they're constructed.
         */
        mediator = factories[feature].mediator(factories[feature].view(app), app, data);
      
      mediators[feature] = mediator;
      return mediator.enter();
    }
    
    function setState(toState, data) {
      // used to hold the outgoing state before overwriting it // 
      let fromState;
      
      /* 
       * Call exit() on the current state, letting
       * it know which state we're going to next.
       */
      return _state.exit(toState)
        .then(() => fromState = _state)
        
        /* 
         * Set the new state
         */
        .then(() => _state = toState)
        
        /* 
         * Call enter() on the new state, letting
         * it know which state we came from.
         */
        .then(() => _state.enter(fromState, data));
    }
    
    const
      canvas = document.getElementById('canvas'),
      stage = new createjs.Stage(canvas);
    _.assign(app, {
        canvas: canvas,
        stage: stage,
        
        // the parent Container for all feature views //
        view: new createjs.Container(),
        
        // positioned above the view by one z-level to hold controls //
        hud: new createjs.Container(),

        setState: setState,
        getStateName() { return _state.getName(); },
        
        /*
         * NOTE: There's no transition method to the initializing
         * state, initializing is reached by calling play() in either
         * the lobby or end states.
         */
        lobby(data) { return _state.lobby(data); },
        play(data) { return _state.play(data); },
        pause(data) { return _state.pause(data); },
        end(data) { return _state.end(data); },

        addUpdateable: function(...addedUpdateables) {
          updateables.push(...addedUpdateables);
          return app;
        },

        removeUpdateable: function(...removedUpdateables) {
          _.each(removedUpdateables, updateable => {
            const index = updateables.indexOf(updateable);
            if (index > -1) updateables.splice(index, 1);
          });
          return app;
        },

        getNumberUpdateables() {
          return updateables.length;
        },
        
        update: function(event) {
          stage.update();
          for (var i = 0; i < updateables.length; i++) {
            updateables[i].update(event);
          }
        },
        
        /**
         * @param: {Boolean} value: If true, the app will log state transitions.
         */
        setDebug(value) {
          _debug = value;
          return app;
        },
        
        /**
         * @return {Boolean}: Returns true if the game is set to debug mode.
         */
        getDebug() {
          return _debug;
        },
      });

    window.addEventListener('resize', onResize, false);

    let resizeTimer;
    function onResize(event) {
      /* 
       * This will basically wait till resizing has stopped
       * to run liquify on the current feature mediator.
       */
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Run code here, resizing has "stopped": delegate to the state //
        _state.liquify();
      }, 250);
      
      setSize();
      app.update(event);
    }

    function setSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // call set size once to set the initial canvas dimensions //
    setSize();

    app.stage.addChild(app.view);
    app.stage.addChild(app.hud);
    createjs.Ticker.framerate = 60;

    // createjs.Touch.enable(_canvas, true, false);

    return app;
  });
}(window, window.createjs, window._));
