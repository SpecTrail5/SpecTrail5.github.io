### Gamey

A CreateJS stateful game controller.

### Installation

Run:

```
bower install --save gamey
```

Include dependencies in the `<head>` tag of your `index.html` file:

```html
<head>
    <title>My Gamey</title>
    <script src="bower_components/lodash/dist/lodash.min.js"></script>
    <script src="bower_components/EaselJS/lib/easeljs.min.js"></script>
    <script src="bower_components/gamey/index.js"></script>
    <!-- more includes... -->
</head>
```

### Implement Views and Mediators

Create a view and mediator factory Function for each of the five game features, `lobby`, `initializing`, `playing`, `paused`, and `end`.

Include these view and mediator files in the `<head>` or `<body>` tag of your `index.html` file, along with the entry point for your app - a JavaScript file to initialize the gamey app, in this example, `game.js`:

```html

<head>
    <title>My Gamey</title>
    <script src="bower_components/lodash/dist/lodash.min.js"></script>
    <script src="bower_components/EaselJS/lib/easeljs.min.js"></script>
    <script src="bower_components/gamey/index.js"></script>
    
    <!-- concrete views and mediators for each game feature -->
    <script src="js/feature/lobby/lobby-mediator.js"></script>
    <script src="js/feature/lobby/lobby-view.js"></script>
    <script src="js/feature/initializing/initializing-mediator.js"></script>
    <script src="js/feature/initializing/initializing-view.js"></script>
    <script src="js/feature/playing/playing-mediator.js"></script>
    <script src="js/feature/playing/playing-view.js"></script>
    <script src="js/feature/paused/paused-mediator.js"></script>
    <script src="js/feature/paused/paused-view.js"></script>
    <script src="js/feature/end/end-mediator.js"></script>
    <script src="js/feature/end/end-view.js"></script>
    
    <!-- app entry point -->
    <script src="game.js"></script>
</head>

```

### Configuring and Creating the Gamey App

When your app launches, in some initializing JavaScript, create an IOC map to hold references to the game feature factory Functions, using their namespaces. Then, to create the gamey app, you can call `window.opspark.gamey(map);`. This will return the instance of the gamey API.

The gamey API exposes the transition methods for each state of the game, `lobby(data);`, `play(data);`, `pause(data);`, and `end(data);`. You can optionally pass a data Object to any of these transition methods; the data Object will be passed to the factory that creates the mediator for the feature. By this, view and mediator construction can be more contextual and flexible.

Note that the `initializing` state has no direct transition method; it is passed through from `lobby` to `playing`, whenever the `lobby-mediator` calls `game.play()`. The `initializing` state can be used for preloading assets, sound, or connecting to a server.

Mediators expose a set of methods; see the example, below. Two of those methods, `enter()` and `exit()` are important in signaling the gamey state machine as to when it's time to move on. These two methods must return a `Promise`, and each should `resolve()` its `Promise` when any entry or exit async operations, including animation or network calls, are complete.

Below is a full example of configuring the IOC map, creating the gamey app, and immediately transitioning to the `lobby` state.

In this example, note the namespaces, for example `opspark.playa.lobbyMediator`. The namespace should match the ones you've registered for your concrete views and mediators.


```javascript
// game.js //
(function(window, opspark, gamey) {
  const
    map = {
      // used to hold view/mediator factories for the concrete game //
      factories: {
        lobby: {
          mediator: opspark.playa.lobbyMediator,
          view: opspark.playa.lobby,
        },
        initializing: {
          mediator: opspark.playa.initializingMediator,
          view: opspark.playa.initializing,
        },
        playing: {
          mediator: opspark.playa.playingMediator,
          view: opspark.playa.playing,
        },
        paused: {
          mediator: opspark.playa.pausedMediator,
          view: opspark.playa.paused,
        },
        end: {
          mediator: opspark.playa.endMediator,
          view: opspark.playa.end,
        }
      },
      // used by gamey to hold references to instances of mediators //
      mediators: {
      },
    },
    game = gamey.app(map);
    
  game.lobby();


}(window, window.opspark, window.opspark.gamey));

```

By using an IOC map, we decouple the gamey state machine from the concrete game's view and mediator implementation, and we can potentially swap behavior of game features at runtime.

### View

Each of the game features must implement a view with a specific API. Here's a template for the current version of gamey - the namespace here shows it's for the lobby view:

```javascript
// lobby-view.js //
(function(opspark, createjs, _) {

  // create a namespace for your view //
  _.set(opspark, 'playa.lobby',
    /**
     * Creates and returns the view.
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


      // add all view components to the view container //
      asset.addChild( /* add components created above */ );


      /**
       * Called when the asset is added to the stage.
       * Use render() to config and position components.
       */
      function render() {
        
        // provide default positions relative to canvas here //

      }

      // called on screen resize //
      function liquify() {
        // If necessary, tween components into position relative to canvas here //
      }

      // setup a one-time added-to-parent listener //
      asset.on('added', onAdded);

      function onAdded() {
        if (game.getDebug()) console.log('lobby view added to stage');
        asset.off('added', onAdded);
        render();
      }

      /*
       * Return the view API: It MUST expose the asset, the render() method, and 
       * the liquify() method. However, any other child components or API needed 
       * to control this view can be exposed.
       */
      return {
        asset,
        render,
        liquify,
        // expose any other view components or API here //
        
      };
    }
  );
}(window.opspark, window.createjs, window._));
```

You can import any other drawing or tween libraries, as needed for your game.

### Mediator

Each of the game features must implement a mediator with a specific API. Here's a template for the current version of gamey - the namespace here shows it's for the lobby mediator:


```javascript
// lobby-mediator.js //
(function(opspark, _) {
  // create a namespace for your mediator //
  _.set(opspark, 'playa.lobbyMediator',
    /**
     * Creates and returns the mediator.
     */
    function(view, game, data) {

      // create event handlers here //


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
          // delegate liquify to the view, or implement your own //
          return view.liquify();
        },
        enter() {
          return new Promise(function(resove, reject) {
            game.view.addChild(view.asset);

            // add event handlers to view components here //

            // call any other enter/open sequence methods on the view //

            resove();
          });
        },
        exit() {
          return new Promise(function(resove, reject) {

            // call any other exit/close sequence methods on the view //

            resove();
          });
        },
        destroy() {
          // remove any event listeners here //

          game.view.removeChild(view.asset);
        }
      };

    }
  );
}(window.opspark, window._));

```

### Playing

The `playing` state/feature is generally where the most magic happens. You can create concrete game asset managers, instantiate them in the `playing-mediator`, and allow them to create and manage their specific game assets.

Managers can expose an `update()` method, used to modify game assets on `tick`. These managers can then be added to the gamey app via `game.addUpdateable(myManager);`. This will cause gamey to call `myManager.update()` on each `tick` event, generally 60 times per second.

Use `game.removeUpdateable(myManager);` to stop the manager from updating its assets. You'll want to do this, say, when transitioning to the `paused` or `end` states.

### Game Over

The `playing` state will eventually, based on your game rules, decide when it's game over by called `game.end();`