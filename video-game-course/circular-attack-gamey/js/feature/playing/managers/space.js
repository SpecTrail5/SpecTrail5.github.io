(function(window, opspark, _) {
  const
    phyz = opspark.racket.physikz;

  /**
   * Creates and returns the space module. Listens for SPAWN 
   * events, adding any bodies in the event
   * @param {Object} messenger: The system wide event dispatcher.
   */
  // create a namespace for the hud //
  _.set(opspark, 'playa.space',
    function(messenger, level) {
      // holds all bodies active in our space //
      const
        // hitTest = phyz[level.hitTest]
        // dampeningForce = 0.08, // = level.dampeningForce,
        active = [];

      messenger.on('SPAWN', onSpawn);

      function onSpawn(event) {
        active.push(...event.bodies);
      }

      messenger.on('DESPAWN', onDespawnOrPool);
      messenger.on('POOL', onDespawnOrPool);

      function onDespawnOrPool(event) {
        event.bodies.forEach(body => active.splice(active.indexOf(body), 1));
      }

      return {
        destroy() {
          messenger.off('SPAWN', onSpawn);
          messenger.off('DESPAWN', onDespawnOrPool);
          messenger.off('POOL', onDespawnOrPool);
        },
        update(event) {
          active.forEach(body => {
            // ask the body to update its velocity //
            body.update(event);

            // update the body's position based on its new velocity //
            phyz.updatePosition(body);
          });

          // loop backwards over each body in the space: note i > 0 //
          for (let i = active.length - 1; i > 0; i--) {
            // pull out each body one by one //
            const bodyA = active[i];

            // compare all other bodies to bodyA, excluding bodyA: note j > -1 //
            hit: for (let j = i - 1; j > -1; j--) {
              const
                bodyB = active[j],
                distanceAttributes = getDistanceAttributes(bodyA, bodyB),
                hitResult = doRadiiHitTest(distanceAttributes.distance, bodyA, bodyB);
              if (hitResult.isHit) {
                handleCollision(distanceAttributes, hitResult, phyz.getImpactProperties(bodyA, bodyB));
              }
            }
          }
        }
      };
    });

  function doRadiiHitTest(distance, bodyA, bodyB) {
    const radiusCombined = bodyA.radius + bodyB.radius;
    return {
      bodyA: bodyA,
      bodyB: bodyB,
      isHit: (distance < radiusCombined),
      minimumDistance: radiusCombined
    };
  }

  function getDistanceAttributes(bodyA, bodyB) {
    const
      distanceX = bodyB.x - bodyA.x,
      distanceY = bodyB.y - bodyA.y,
      angle = Math.atan2(distanceY, distanceX);
    return {
      bodyA,
      bodyB,
      angle,
      distanceX,
      distanceY,
      distance: Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    };
  }

  function handleCollision(distanceAttributes, hitResult, impactProperties) {
    const
      bodyA = distanceAttributes.bodyA,
      bodyB = distanceAttributes.bodyB,
      angle = distanceAttributes.angle,
      distanceX = distanceAttributes.distanceX,
      distanceY = distanceAttributes.distanceY,
      distance = distanceAttributes.distance,
      minimumDistance = hitResult.minimumDistance,
      impact = impactProperties.impact;

    // ANOTHER WAY TO CALC SPRING TO POINT //
    const
      springToX = bodyA.x + distanceX / distance * minimumDistance,
      springToY = bodyA.y + distanceY / distance * minimumDistance;

    // const
    //   springToX = Math.cos(angle) * minimumDistance + bodyA.x,
    //   springToY = Math.sin(angle) * minimumDistance + bodyA.y;

    const
      dampeningForce = 0.05,
      ax = (springToX - bodyB.x) * dampeningForce,
      ay = (springToY - bodyB.y) * dampeningForce;

    bodyA.velocityX -= ax;
    bodyA.velocityY -= ay;
    bodyB.velocityX += ax;
    bodyB.velocityY += ay;

    // each body should then handle the impact //
    bodyA.handleCollision(impact, bodyB);
    bodyB.handleCollision(impact, bodyA);
  }
}(window, window.opspark, window._));
