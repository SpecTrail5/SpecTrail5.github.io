/**
 * racket : To assist in some gaming utility and physics for animation.
 * 
 * The racket namespace currently contains the two libraries:
 * 
 * 1. physikz: supports cheap physics and collision detection.
 * 2. num: a lib of utility methods to work with numbers.
 * 
 * dependencies: See the bower.json file for current dependency versions, 
 * and ensure you add dependencies to your index.html file, as in:
 * 
 * <script src="bower_components/lodash/lodash.min.js"></script>
 *
 */
(function(window, _) {
    window.opspark = window.opspark || {};

    function sortNumbersAscending(a, b) { return a - b; }

    function sortNumbersDecending(a, b) { return b - a; }

    function randomIntBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Converts degrees to radians:
     * radians = degrees * Math.PI / 180
     * 
     * @param {Number} degrees: A Number between 0 and 360 
     * represeting the degree mesurement of an angle.
     * @return {Number} The degrees converted to radians.
     */
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * Converts radians to degrees:
     * degrees = radians * 180 / Math.PI 
     * 
     * @param {Number} radians: A Number representing the 
     * radian measurement of an angle.
     * @return {Number} The radians converted to degrees.
     */
    function radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    /**
     * Using the Pythagorean theorem, returns the distance
     * between to points.
     * 
     * @param {Object} pointOne: A point with x and y values
     * in a cartesian coordinate system.
     * @param {Object} pointTwo: A point with x and y values
     * in a cartesian coordinate system.
     * @return {Number} The distance between the two points.
     */
    function getDistance(pointOne, pointTwo) {
        var distanceX = pointTwo.x - pointOne.x;
        var distanceY = pointTwo.y - pointOne.y;
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }

    /**
     * Returns an Object containing distance properties related to
     * the distance between to bodies, including decomposing the 
     * distance on the x and y axis.
     * 
     * @param {Object} bodyA: An Object with physical properties.
     * @param {Object} bodyB: An Object with physical properties.
     * @return {Object} Includes bodyA, bodyB, distanceX, distanceY, and distance.
     */
    function getDistanceProperties(bodyA, bodyB) {
        var distanceX = bodyB.x - bodyA.x;
        var distanceY = bodyB.y - bodyA.y;
        return {
            bodyA: bodyA,
            bodyB: bodyB,
            distanceX: distanceX,
            distanceY: distanceY,
            distance: Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        };
    }

    /**
     * Takes two circle shaped bodies, and determins if they're
     * colliding.
     * 
     * @param {Number} distance: The distance between the two body's center.
     * @param {Object} bodyA: An Object with physical properties - must have a radius property.
     * @param {Object} bodyB: An Object with physical properties - must have a radius property.
     * @return {Object} Includes bodyA, bodyB, isHit, and radiusCombined.
     */
    function hitTestRadial(distance, bodyA, bodyB) {
        var radiusCombined = bodyA.radius + bodyB.radius;
        return {
            bodyA: bodyA,
            bodyB: bodyB,
            isHit: (distance < radiusCombined),
            radiusCombined: radiusCombined
        };
    }

    /**
     * Takes two bodies that have collided and returns an Object with 
     * information on the impact event.
     * @param {Object} bodyA: An Object with physical properties.
     * @param {Object} bodyB: An Object with physical properties.
     * @return {Object} Includes bodyA, bodyB, combinedVolatility, combinedDensity, and impact.
     */
    function getImpactProperties(bodyA, bodyB) {
        var combinedVolatility = bodyA.volatility + bodyB.volatility;
        var combinedDensity = bodyA.density + bodyB.density;
        return {
            bodyA: bodyA,
            bodyB: bodyB,
            combinedVolatility: combinedVolatility,
            combinedDensity: combinedDensity,
            impact: (combinedVolatility ? combinedVolatility * combinedDensity : combinedDensity)
        };
    }

    var racket = {
        physikz: {
            /**
             * Within an area, applies random velocity to a body. Note, 
             * if the body argument is not a proper body, it is extended 
             * to become one.
             * 
             * @param {Object} body: An Object with physical properties.
             * @param {Object} area: An Object with a width and height property.
             * @param {Number} multiplierX: Defaults to .6, applied to the body's
             * velocity on the x axis.
             * @param {Number} multiplierY: Defaults to .5, applied to the body's
             * velocity on the y axis.
             */
            addRandomVelocity: function(body, area, multiplierX = .6, multiplierY = .5) {
                if (!body.integrity) { _.extend(body, this.makeBody()); }

                var tx = randomIntBetween(0, area.width);
                var ty = randomIntBetween(0, area.height);
                var dx = Math.abs(tx - body.x);
                var dy = Math.abs(ty - body.y);
                var radians = Math.atan2(dy, dx);
                body.rotation = radiansToDegrees(radians);

                var rotationalDirection = (Math.round(Math.random()) === 1) ? 1 : -1;
                body.rotationalVelocity = randomIntBetween(1, 3) * rotationalDirection;
                var forceX = Math.cos(radians) * (Math.random() * multiplierX);
                var forceY = Math.sin(radians) * (Math.random() * multiplierY);

                body.velocityX = (tx > body.x) ? forceX : -forceX;
                body.velocityY = (ty > body.y) ? forceY : -forceY;
            },

            /**
             * Updates the body's position using its magnitude in the directions 
             * x, y and rotation.
             * 
             * @param {Object} body: An Object with physical properties.
             */
            updatePosition: function(body) {
                body.x += body.velocityX;
                body.y += body.velocityY;
                body.rotation += body.rotationalVelocity;
            },

            reboundCircularAssetInArea: function(body, area) {
                const
                    radius = body.radius,
                    top = 0,
                    left = 0,
                    right = area.width,
                    bottom = area.height;

                // check for hit on either side of area //
                if (body.x + radius > right) {
                    body.x = right - radius;
                    body.velocityX *= -1;
                } else if (body.x - radius < left) {
                    body.x = left + radius;
                    body.velocityX *= -1;
                }

                // check for hit on top or bottom //
                if (body.y - radius < top) {
                    body.y = top + radius;
                    body.velocityY *= -1;
                } else if (body.y + radius > bottom) {
                    body.y = bottom - radius;
                    body.velocityY *= -1;
                }
            },

            updateVelocity(body, forceOnX, forceOnY) {
                const
                    angle = body.rotation * Math.PI / 180,
                    accelerationOnX = Math.cos(angle) * forceOnX,
                    accelerationOnY = Math.sin(angle) * forceOnY;
                body.velocityX += accelerationOnX;
                body.velocityY += accelerationOnY;
            },

            updateRadialPositionInArea: function(body, area) {
                var radius = body.radius;
                var w = area.width + radius * 2;
                var h = area.height + radius * 2;

                body.x = (body.x + radius + body.velocityX + w) % w - radius;
                body.y = (body.y + radius + body.velocityY + h) % h - radius;
                body.rotation += body.rotationalVelocity;
            },

            /**
             * Updates the body's position using its magnitude in the directions 
             * x, y and rotation, but the body will rebound if it collides with 
             * any edge of the area.
             * 
             * @param {Object} body: An Object with physical properties.
             * @param {Object} area: An Object with a width and height property.
             */
            updateRadialPositionAndReboundInArea: function(body, area) {
                var radius = body.radius;
                var top = 0;
                var left = 0;
                var right = area.width;
                var bottom = area.height;

                body.x += body.velocityX;
                body.y += body.velocityY;
                body.rotation += body.rotationalVelocity;

                if (body.x + radius > right) {
                    body.x = right - radius;
                    body.velocityX *= -1;
                } else if (body.x - radius < left) {
                    body.x = left + radius;
                    body.velocityX *= -1;
                }

                if (body.y + radius > bottom) {
                    body.y = bottom - radius;
                    body.velocityY *= -1;
                } else if (body.y - radius < top) {
                    body.y = top + radius;
                    body.velocityY *= -1;
                }
            },

            /**
             * Takes a circular body with an x, y and radius property,
             * and an area with width and height properties, and
             * determines if the body is outside of the area.
             * 
             * @param {Object} body: An Object with an x, y and radius property.
             * @param {Object} area: An Object with width and height properties.
             * @return {Boolean} Returns true if the body is outside of the area,
             * false otherwise.
             */
            isRadialOutOfArea: function(body, area) {
                var radius = body.radius;
                var areaWidth = area.width + radius;
                var areaHeight = area.height + radius;

                if (body.x > areaWidth) {
                    return true;
                } else if (body.x < -body.radius) {
                    return true;
                }

                if (body.y > areaHeight) {
                    return true;
                } else if (body.y < -body.radius) {
                    return true;
                }
                return false;
            },

            /**
             * getDistance: Using the Pythagorean Theorem, returns the 
             * distance between two points.
             *
             * @return {Number} A Number representing the distance between two points.
             */
            getDistance: getDistance,

            /**
             * getDistanceProperties: Using the Pythagorean Theorem, returns an 
             * distance object with properties distance, distanceX, and distanceY.
             *
             * @return {Object} An object with properties pointOne, pointTwo, 
             * distance, distanceX, and distanceY.
             */
            getDistanceProperties: getDistanceProperties,

            /**
             * Takes two bodies, returns an object with their combinedVolatility, 
             * combinedDensity, and impact.
             * 
             * @return {Object} An Object containing information about the impact event.
             */
            getImpactProperties: getImpactProperties,

            /**
             * hitTestRadial: Expects the distance betwo bodies with a radius property. Returns 
             * an object with the result of the radial hit test, with the 
             * property isHit being true if the distance between the x/y of 
             * the radial shapes is less than the sum of their two radius.
             *
             * @return {Object} An Object with the results of the combined radius hit test.
             */
            hitTestRadial: hitTestRadial,

            /**
             * Takes an Array of bodies to manage as the space, a hitTest 
             * Function to perform between each body in the space, and a 
             * handleCollision Function designed to respond to collision.
             * 
             * @param {Array} space: An Array of bodies.
             * @param {Function} hitTest: A Function to test if any two 
             * bodies are colliding at the current point in time in space.
             * @param {Function} handleCollision: A Function to decide 
             * what happens when two bodies in the space collide.
             */
            updateSpace: function(space, hitTest, handleCollision) {
                for (var i = space.length - 1; i > 0; i--) {
                    var bodyA = space[i];
                    for (var j = i - 1; j > -1; j--) {
                        var bodyB = space[j];
                        var distanceProperties = getDistanceProperties(bodyA, bodyB);
                        var hitResult = hitTest(distanceProperties.distance, bodyA, bodyB);
                        if (hitResult.isHit) {
                            handleCollision(distanceProperties, hitResult, getImpactProperties(bodyA, bodyB));
                        }
                    }
                }
            },

            /**
             * Returns an Object with basic properties utilized in a 
             * 2D physics system. On top of simple physical properties,
             * the body has template methods handleCollision() and update().
             * 
             * @param {String} type: A String, should be unique to your
             * system, representing the type of body.
             * @param {Object} [options = {}]. Options will default
             * @param {Number} options.velocityX: The body's velocity on the x axis. Defaults to 0.
             * @param {Number} options.velocityY: The body's velocity on the y axis. Defaults to 0.
             * @param {Number} options.rotationalVelocity: The body's rotational velocity. Defaults to 0.
             * @param {Number} options.integrity: The body's integrity. 0 means the 
             * body is no longer intact and should explode or break apart, 1 means 
             * the body is fully intact. Defaults to 1.
             * @param {Number} options.density: The density of the body, can be 
             * used when calculating the force of impact of a collision, which can 
             * then be distributed to affect the kinetic energy of the colliding bodies. Defaults to 1.
             * @param {Number} options.volatility: The body's volatility, how unstable or
             * explosive it may be. Can be used as a multiplyer when calculating the 
             * force of impact of a collision. Defaults to 0.
             * @return {Object}
             */
            makeBody: function(type, {
                velocityX = 0,
                velocityY = 0,
                rotationalVelocity = 0,
                integrity = 1,
                density = 1,
                volatility = 0
            } = {}) {
                if (type === undefined) throw new Error('You must provide a valid String for the type parameter!');
                return {
                    type: type,
                    velocityX: velocityX,
                    velocityY: velocityY,
                    rotationalVelocity: rotationalVelocity,
                    integrity: integrity,
                    density: density,
                    volatility: volatility,

                    /**
                     * @param {Number} A number representing the force of the impact.
                     * @param {Object} The other body involved in the collision.
                     */
                    handleCollision(impact, body) {
                        // template method //
                    },

                    update() {
                        // template method //
                    }
                };
            },

            degreesToRadians: degreesToRadians,
            radiansToDegrees: radiansToDegrees
        },

        num: {
            randomIntBetween: randomIntBetween,
            sortNumbersAscending: sortNumbersAscending,
            sortNumbersDecending: sortNumbersDecending,
            degreesToRadians: degreesToRadians,
            radiansToDegrees: radiansToDegrees
        }
    };
    window.opspark.racket = racket;
}(window, window._));
