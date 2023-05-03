(function(window, opspark, _) {
  const Proton = window.Proton;

  // create a namespace for the fx (effects) manager //
  _.set(opspark, 'playa.fx',
    /**
     * Creates and returns the fx manager.
     */
    function(game, view) {
      const
        canvas = game.canvas,
        stage = game.stage,
        proton = new Proton,
        renderer = new Proton.Renderer('easel', proton, view);

      // must be called at startup //
      renderer.start();

      function makeEmitter(radiusMin, radiusMax, color, velocity, behaviours) {
        const
          protonEmitter = makeProtonEmitter(radiusMin, radiusMax, color, velocity, behaviours),
          emitter = {
            protonEmitter,

            emit: function(point, emitTime) {
              protonEmitter.emit(emitTime);
              protonEmitter.p.x = point.x;
              protonEmitter.p.y = point.y;
            },

            stop: function() {
              protonEmitter.stopEmit();
            },

            destroy: function() {
              proton.removeEmitter(protonEmitter);
            }
          };
        return emitter;
      }

      function makeProtonEmitter(radiusMin, radiusMax, color, velocity, behaviours) {
        var emtr;

        emtr = new Proton.Emitter();
        emtr.rate = new Proton.Rate(new Proton.Span(1, 2), .012);
        emtr.addInitialize(velocity || new Proton.Velocity(new Proton.Span(1, 2), new Proton.Span(0, 360), 'polar'));
        emtr.addInitialize(new Proton.Mass(1));
        emtr.addInitialize(new Proton.Radius(radiusMin || 2, radiusMax || 4));
        emtr.addInitialize(new Proton.Life(0.5, 0.5));
        emtr.addBehaviour(new Proton.Collision(emtr));
        emtr.addBehaviour(new Proton.Color(color || "rgba(0, 0, 0, 0.2)"));

        if (behaviours) {
          behaviours.forEach(function(behaviour) {
            emtr.addBehaviour(behaviour);
          });
        }

        emtr.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'bound'));
        emtr.damping = 0.02;

        proton.addEmitter(emtr);

        return emtr;
      }

      /*
       * Some game defaults.
       */
      function makePlayerEmitter() {
        return makeEmitter(null, null, null, new Proton.Velocity(new Proton.Span(1, 2), [45, 135, 225, 315], 'polar'));
      }

      // return particle manager api //
      return {
        // delegate to the proton update() method //
        update() { proton.update(); },
        makeEmitter: makeEmitter,
        makePlayerEmitter: makePlayerEmitter,
        removeEmitter: function(emitter) {
          proton.removeEmitter(emitter);
        },
        renderer,
        proton,
      };
    });
}(window, window.opspark, window._));
