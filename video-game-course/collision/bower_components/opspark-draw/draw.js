/**
 * draw.js : To assist in learning, a wrapper of the CreateJS 
 * Graphic API to reduce boiler-plate. draw.js also supports 
 * calculation of width and height properties on shapes.
 * 
 * dependencies: "EaselJS": "1.0.2"
 * 
 * In your index.html file, include:
 * 
 * <script src="bower_components/EaselJS/lib/easeljs.min.js"></script>
 * 
 * For CreateJS Graphic API not wrapped by this version, use the Graphic API directly.
 * See: http://www.createjs.com/Docs/EaselJS/classes/Graphics.html
 *
 */
(function (window) {
    const TYPE_RECTANGULAR  = 'retangular';
    const TYPE_CIRCULAR     = 'circular';
    const TYPE_TRIANGULAR   = 'triangular';
    const TYPE_IRREGULAR    = 'irregular';
    const TYPE_LINEAR       = 'linear';
    
    // use the opspark namespace //
    window.opspark = window.opspark || {};
    
    const createjs = window.createjs;
    
    /**
     * sortNumbersAscending: A sorting method to be used with an Array of Number. Sorts numbers ascending.
     * @param {Number} a: The first number to compare. 
     * @param {Number} b: The second number to compare.
     * @return {Number} Either 1, -1 or 0 for sorting purposes.
     */
    function sortNumbersAscending(a, b) { return a - b; }
    
    /**
     * sortNumbersDescending: A sorting method to be used with an Array of Number. Sorts numbers descending.
     * @param {Number} a: The first number to compare. 
     * @param {Number} b: The second number to compare.
     * @return {Number} Either 1, -1 or 0 for sorting purposes.
     */
    function sortNumbersDescending(a, b) { return b - a; }
    

    /**
     * randomIntBetween: Returns a randomly selected number between the min and max, inclusive.
     * @param {Number} min: The minimum number of the range, inclusive.
     * @param {Numbrer} max : The maximum number of the range, inclusive.
     * @return {Number} The randomly selected Number within the range.
     */
    function randomIntBetween(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    /**
     * blurFilterOn: Applies a blur filter to the provided displayObject.
     * @param {DisplayObject} displayObject: A CreateJS DisplayObject to which the blur filter will be applied.
     * @param {Number} blurX: The blur value on the x axis, the horizontal blur radius in pixels.
     * @param {Number} blurY: The blur value on the y axis, the vertical blur radius in pixels.
     * @param {Number} quality: The number of blur iterations, representing quality or sharpness.
     * @return {DisplayObject} Returns the displayObject, blur filter applied.
     */
    function blurFilterOn(displayObject, blurX = 5, blurY = 5, quality = 1) {
        var blurFilter = new createjs.BlurFilter(blurX, blurY, quality);
        displayObject.filters = (displayObject.filters) ? displayObject.filters.concat(blurFilter) : [blurFilter];
        displayObject.cache(-displayObject.radius, -displayObject.radius, displayObject.width, displayObject.height);
        return displayObject;
    }
    
    /**
     * randomColor: Generates a random RGBA hexidecimal color value with the max ranges provided by r, g, b, a
     * @param {Number} r: A Number between 0 and 255. 
     * @param {Number} g: A Number between 0 and 255.
     * @param {Number} b: A Number between 0 and 255.
     * @param {Number} a: A Number btween 0 and 1, ie, 0.3. 0 being full transparent, 1 being fully opaque.
     * @return {String} A String representing a hexidecimal number, or, if alpha is present, representing the rgba() function.
     */
    function randomColor(r, g, b, a) {
        if (a) { return 'rgba(' + randomRGBRange(r) + ','  + randomRGBRange(g) + ',' + randomRGBRange(b) + ',' + a + ')'; }
        return '#' + randomRGBRange(r) + randomRGBRange(g) + randomRGBRange(b);
    }

    /**
     * randomRGBRange: Returns a randomly selected number from 0 up to the maxRange, or 255.
     * @param {Number} maxRange: The maximum of the range.
     * @return {String} A String representing a hexidecimal number.
     */
    function randomRGBRange(maxRange) {
        return Math.floor(Math.random() * (maxRange + 1)).toString(16); 
    }
    
    /**
     * getStartPointX: Used to find start x of a DisplayObject, ie, where the shape starts on the x axis. 
     * Takes into account xOffset, and, radius and xOffset only for TYPE_CIRCULAR shapes.
     * @param {Object} object: A DisplayObject.
     * @return {Number} The start point x.
     */
    function getStartPointX(object) {
        switch (object.type) {
            case TYPE_CIRCULAR:
                return -(object.radius) + object.xOffset;
            default:
                return object.xOffset;
        }
    }
    
    /**
     * getStartPointY: Used to find start y of a DisplayObject, ie, where the shape starts on the y axis. 
     * Takes into account yOffset, and, radius and yOffset only for TYPE_CIRCULAR shapes.
     * @param {Object} object: A DisplayObject. 
     * @return {Number} The start point y.
     */
    function getStartPointY(object) {
        switch (object.type) {
            case TYPE_CIRCULAR:
                return -(object.radius) + object.yOffset;
            default:
                return object.yOffset;
        }
    }
    
    /**
     * getEndPointX: Used to find end x of a DisplayObject, ie, where the shape ends on the x axis. 
     * Takes into account xOffset and width, and, radius and xOffset only for TYPE_CIRCULAR shapes.
     * @param {Object} object: A DisplayObject.
     * @return {Number} The end point x.
     */
    function getEndPointX(object) {
        switch (object.type) {
            case TYPE_CIRCULAR:
                return object.radius + object.xOffset;
            default:
                return object.xOffset + object.width;
        }
    }
    
    /**
     * getEndPointY: Used to find end y of a DisplayObject, ie, where the shape ends on the y axis. 
     * Takes into account yOffset and height, and, radius and height only for TYPE_CIRCULAR shapes.
     * @param {Object} object: A DisplayObject. 
     * @return {Number} The end point y.
     */
    function getEndPointY(object) {
        switch (object.type) {
            case TYPE_CIRCULAR:
                return object.radius + object.yOffset;
            default:
                return object.yOffset + object.height;
        }
    }
    
    /**
     * buildDimensions: Returns an Object with dimension properties.
     * @param {String} type: One of the various shape types, like TYPE_CIRCULAR.
     * @param {Number} width: The width in pixels. 
     * @param {Number} height: The height in pixels.
     * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
     * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
     * @param {Number} radius: The radius, if TYPE_CIRCULAR, etc.
     * @return {Object} A map of the dimension.
     */
    function buildDimensions(type, width, height, xOffset, yOffset, radius) {
        const dimensions = {
            type: type,
            width: width,
            height: height,
            xOffset: (xOffset) ? xOffset : 0,
            yOffset: (yOffset) ? yOffset : 0
        };
        if (radius) { dimensions.radius = radius; }
        return dimensions;
    }
    
    const draw = {
        /**
         * setDimensionsOn: Takes a Shape, calculates its dimensions, and writes those dimensions to the shape, returns the Shape.
         * By writing dimensions to the Shape, ie, width, height, we can use these values within calculations for hit detection.
         * @param {Shape} shape: A CreateJS Shape.
         * @param {Object} dimensions: A map of dimensions to be used to calculate width, height, etc.
         * @return {Shape} The Shape passed as shape, with dimensions applied.
         */
        setDimensionsOn: function (shape, dimensions) {
            /*
             * If the shape already has dimensions, it means we're adding graphics to it, making it composite.
             */
            if (shape.dimensions) {
                // first figure out the points of extremity //
                const
                    xStartPoint = [getStartPointX(shape), getStartPointX(dimensions)].sort(sortNumbersAscending)[0],
                    xEndPoint = [getEndPointX(shape), getEndPointX(dimensions)].sort(sortNumbersAscending)[1],
                    yStartPoint = [getStartPointY(shape), getStartPointY(dimensions)].sort(sortNumbersAscending)[0],
                    yEndPoint = [getEndPointY(shape), getEndPointY(dimensions)].sort(sortNumbersAscending)[1];

                let xs = 0, ys = 0;
                
                /*
                 * for the width calculation, we don't care about the y value 
                 * of the points of comparison, and vice versa for height.
                 */
                xs = xEndPoint - xStartPoint;
                xs = xs * xs;
                dimensions.width = Math.sqrt(xs + ys);
                
                xs = 0;
                ys = yEndPoint - yStartPoint;
                ys = ys * ys;
                dimensions.height = Math.sqrt(xs + ys);
                
                dimensions.xOffset = xStartPoint;
                dimensions.yOffset = yStartPoint;
                
                /*
                 * If we're compounding graphics, the shape is now irregular.
                 */
                dimensions.type = TYPE_IRREGULAR;
                
                /*
                 * We don't need to track radius on irregular objects.
                 */
                if (shape.radius) { delete shape.radius; }
            }
            
            shape.setBounds(dimensions.xOffset, dimensions.yOffset, dimensions.width, dimensions.height);
            shape.dimensions = dimensions;
            shape.width = dimensions.width;
            shape.height = dimensions.height;
            shape.xOffset = dimensions.xOffset;
            shape.yOffset = dimensions.yOffset;
            shape.type = dimensions.type;

            // debug //
            // console.log(shape.width);
            // console.log(shape.height);
            
            return shape;
        },
        
        /**
         * line: Draws a line on a new CreateJS Shape, unless a Shape is provided in onShape param, in 
         * which case draws the line on the onShape Shape, forming a composite Shape.
         * @param {Number} fromX: The starting x position for the line.
         * @param {Number} fromY: The starting y position for the line.
         * @param {Number} toX: The ending x position for the line.
         * @param {Number} toY: The ending y position for the line.
         * @param {String} strokeColor: A hexidecimal number, the color of the line.
         * @param {Number} strokeStyle: The line thickness in pixels.
         * @param {Shape} onShape: If provided, will draw the line on this Shape, updating its dimensions.
         * @return {Shape}: With the line drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        line: function (fromX, fromY, toX, toY, strokeColor, strokeStyle, onShape) {
            const 
                dimensions = buildDimensions(TYPE_LINEAR, toX, toY, fromX, fromY),
                shape = (onShape) ? onShape : new createjs.Shape();
            shape.graphics
                .setStrokeStyle(strokeStyle)
                .beginStroke(strokeColor)
                .moveTo(dimensions.xOffset, dimensions.yOffset)
                .lineTo(toX, toY);
                
            return draw.setDimensionsOn(shape, dimensions);
        },
        
        /**
         * rect: Draws a rectangle on a new Shape or the provided onShape.
         * @param {Number} width: The width in pixels.
         * @param {Number} height: The height in pixels.
         * @param {String} strokeColor: The fill color, hexidecimal.
         * @param {Number} strokeStyle: The border thickness in pixels.
         * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Shape} onShape: If provided, will draw the rectangle on this Shape, updating its dimensions.
         * @return {Shape}: With the rectangle drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        rect: function (width, height, color, strokeColor, strokeStyle, xOffset, yOffset, onShape) { 
            const
                dimensions = buildDimensions(TYPE_RECTANGULAR, width, height, xOffset, yOffset),
                shape = (onShape) ? onShape : new createjs.Shape();
            shape.graphics
                .setStrokeStyle(strokeStyle)
                .beginStroke(strokeColor)
                .beginFill(color)
                .drawRect(dimensions.xOffset, dimensions.yOffset, width, height);
                
            return draw.setDimensionsOn(shape, dimensions, onShape);
        },
        
        /**
         * roundRect: Draws a rectangle with rounded cornders on a new Shape or the provided onShape. The corner radius will be applied to all corners.
         * @param {Number} width: The width in pixels.
         * @param {Number} height: The height in pixels.
         * @param {Number} radius: The corner radius in pixels. Radius will be applied to all corners.
         * @param {String} color: The fill color, hexidecimal.
         * @param {String} strokeColor: The stroke color, hexidecimal.
         * @param {Number} strokeStyle: The border thickness in pixels.
         * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Shape} onShape: If provided, will draw the rounded rectangle on this Shape, updating its dimensions.
         * @return {Shape}: With the rounded rectangle drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        roundRect: function (width, height, radius, color, strokeColor, strokeStyle, xOffset, yOffset, onShape) {
            const
                dimensions = buildDimensions(TYPE_RECTANGULAR, width, height, xOffset, yOffset),
                shape = (onShape) ? onShape : new createjs.Shape();
            shape.graphics
                .setStrokeStyle(strokeStyle)
                .beginStroke(strokeColor)
                .beginFill(color)
                .drawRoundRect(dimensions.xOffset, dimensions.yOffset, width, height, radius);

            draw.setDimensionsOn(shape, dimensions);
            shape.dimensions.cornerRadius = radius;
            return shape;
        },
        
        /**
         * roundRectComplex: Draws a rectangle with optional rounded cornders on a new Shape or the provided onShape. Unlike roundRect, roundRectComplex can have a different radius per corner.
         * @param {Number} width: The width in pixels.
         * @param {Number} height: The height in pixels.
         * @param {Number} radiusTopLeft: The top left corner radius in pixels.
         * @param {Number} radiusTopRight: The top right corner radius in pixels.
         * @param {Number} radiusBottomRight: The bottom right corner radius in pixels.
         * @param {Number} radiusBottomLeft: The bottom left corner radius in pixels.
         * @param {String} color: The fill color, hexidecimal.
         * @param {String} strokeColor: The stroke color, hexidecimal.
         * @param {Number} strokeStyle: The border thickness in pixels.
         * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Shape} onShape: If provided, will draw the complex rounded rectangle on this Shape, updating its dimensions.
         * @return {Shape}: With the complex rounded rectangle drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        roundRectComplex: function (width, 
                                    height, 
                                    radiusTopLeft, 
                                    radiusTopRight, 
                                    radiusBottomRight, 
                                    radiusBottomLeft, 
                                    color, 
                                    strokeColor, 
                                    strokeStyle, 
                                    xOffset, 
                                    yOffset, 
                                    onShape) {
            const
                dimensions = buildDimensions(TYPE_RECTANGULAR, width, height, xOffset, yOffset),
                shape = (onShape) ? onShape : new createjs.Shape();
            shape.graphics
                .setStrokeStyle(strokeStyle)
                .beginStroke(strokeColor)
                .beginFill(color)
                .drawRoundRectComplex(dimensions.xOffset, 
                                      dimensions.yOffset, 
                                      width, 
                                      height, 
                                      radiusTopLeft, 
                                      radiusTopRight, 
                                      radiusBottomRight, 
                                      radiusBottomLeft);
                                      
            draw.setDimensionsOn(shape, dimensions);
            shape.dimensions.radiusTopLeft = radiusTopLeft;
            shape.dimensions.radiusTopRight = radiusTopRight;
            shape.dimensions.radiusBottomRight = radiusBottomRight;
            shape.dimensions.radiusBottomLeft = radiusBottomLeft;
            return shape;
        },

        /**
         * circle: Draws a circle on a new Shape or the provided onShape.
         * @param {Number} radius: The radius in pixels.
         * @param {String} color: The fill color, hexidecimal.
         * @param {String} strokeColor: The stroke color, hexidecimal.
         * @param {Number} strokeStyle: The border thickness in pixels.
         * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Shape} onShape: If provided, will draw the circle on this Shape, updating its dimensions.
         * @return {Shape}: With the circle drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        circle: function (radius, color, strokeColor, strokeStyle, xOffset, yOffset, onShape) { 
            const
                dimensions = buildDimensions(TYPE_CIRCULAR, radius * 2, radius * 2, xOffset, yOffset, radius),
                shape = (onShape) ? onShape : new createjs.Shape();
            shape.graphics
                .setStrokeStyle(strokeStyle)
                .beginStroke(strokeColor)
                .beginFill(color)
                .drawCircle(dimensions.xOffset, dimensions.yOffset, radius);
            
            draw.setDimensionsOn(shape, dimensions);
            shape.radius = radius;
            return shape;
        },

        /**
         * ellipse: Draws a ellipse on a new Shape or the provided onShape. NOte, ellipse has no radius.
         * @param {Number} width: The width in pixels.
         * @param {Number} height: The height in pixels.
         * @param {String} color: The fill color, hexidecimal.
         * @param {String} strokeColor: The stroke color, hexidecimal.
         * @param {Number} strokeStyle: The border thickness in pixels.
         * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Shape} onShape: If provided, will draw the ellipse on this Shape, updating its dimensions.
         * @return {Shape}: With the ellipse drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        ellipse: function (width, height, color, strokeColor, strokeStyle, xOffset, yOffset, onShape) {
            const
                dimensions = buildDimensions(TYPE_RECTANGULAR, width, height, xOffset, yOffset),
                shape = (onShape) ? onShape : new createjs.Shape();
            shape.graphics
                .setStrokeStyle(strokeStyle)
                .beginStroke(strokeColor)
                .beginFill(color)
                .drawEllipse(dimensions.xOffset, dimensions.yOffset, width, height);
                
            return draw.setDimensionsOn(shape, dimensions);
        },

        /**
         * polyStar: Draws a polyStar on a new Shape or the provided onShape.
         * @param {Number} radius: The radius in pixels.
         * @param {Number} sides: The number of sides to the polyStar.
         * @param {Number} pointSize: The size of the ends of the points of the polyStar.
         * @param {Number} angle: The angle of the points of the polyStar.
         * @param {String} color: The fill color, hexidecimal.
         * @param {String} strokeColor: The stroke color, hexidecimal.
         * @param {Number} strokeStyle: The border thickness in pixels.
         * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Shape} onShape: If provided, will draw the polyStar on this Shape, updating its dimensions.
         * @return {Shape}: With the polyStar drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        polyStar: function (radius, sides, pointSize, angle, color, strokeColor, strokeStyle, xOffset, yOffset, onShape) {
            const
                dimensions = buildDimensions(TYPE_CIRCULAR, radius * 2, radius * 2, xOffset, yOffset, radius),
                shape = (onShape) ? onShape : new createjs.Shape();
            shape.graphics
                .setStrokeStyle(strokeStyle)
                .beginStroke(strokeColor)
                .beginFill(color)
                .drawPolyStar(dimensions.xOffset, dimensions.yOffset, radius, sides, pointSize || 0, angle);
            
            draw.setDimensionsOn(shape, dimensions);
            shape.radius = radius;
            return shape;
        },
        
        /**
         * randomCircle: Draws a randomly sized and colored circle.
         * @param {Boolean} randomizeAlpha: If true, will randomly select the alpha value between 0 and .999.
         * @param {Boolean} addCross: If true, will draw a lined cross through the middle of the circle, useful if the circle is intended to rotate.
         * @param {Number} pointSize: The size of the ends of the points of the polyStar.
         * @param {Number} angle: The angle of the points of the polyStar.
         * @param {String} color: The fill color, hexidecimal.
         * @param {String} strokeColor: The stroke color, hexidecimal.
         * @param {Number} strokeStyle: The border thickness in pixels.
         * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Shape} onShape: If provided, will draw the polyStar on this Shape, updating its dimensions.
         * @return {Shape}: With the polyStar drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        randomCircle: function (randomizeAlpha, addCross, strokeColor, strokeStyle, randomRadialProps) {
            let props, circle;
            
            props = (randomRadialProps) ? randomRadialProps : draw.randomRadialProps();
            
            if (addCross) {
                // always make sure the cross is visible - it won't be if randomizeAlpha is false //
                randomizeAlpha = true;
                circle = draw.line(-(props.radius), 0, props.radius, 0, strokeColor  || '#000', 2);
                draw.line(0, -(props.radius), 0, props.radius, strokeColor || '#000', 2, circle);
            }
            
            if (strokeColor && !strokeStyle) { strokeStyle = 1; }
            
            // first draw the circle's border - don't use stroke //
            circle = draw.circle(props.radius+strokeStyle, strokeColor, null, null, null, null, circle);
            draw.circle(props.radius, props.color, null, null, null, null, circle);
            circle.x = props.x;
            circle.y = props.y;
            
            if (randomizeAlpha) {circle.alpha = Math.random(); }
            
            return circle;
        },
        
        /**
         * randomCircleInArea: Draws a randomly sized and colored circle, and randomly sets its x, y properties within the area.
         * @param {Boolean} randomizeAlpha: If true, will randomly select the alpha value between 0 and .999.
         * @param {Boolean} addCross: If true, will draw a lined cross through the middle of the circle, useful if the circle is intended to rotate.
         * @param {Number} pointSize: The size of the ends of the points of the polyStar.
         * @param {Number} angle: The angle of the points of the polyStar.
         * @param {String} color: The fill color, hexidecimal.
         * @param {String} strokeColor: The stroke color, hexidecimal.
         * @param {Number} strokeStyle: The border thickness in pixels.
         * @param {Number} xOffset: The x offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Number} yOffset: The y offset from the shapes registration point. Registration point is its own (x, y) point, where it'll be positioned in its parent.
         * @param {Shape} onShape: If provided, will draw the polyStar on this Shape, updating its dimensions.
         * @return {Shape}: With the polyStar drawn on it, either a new Shape, or the Shape passed as onShape.
         */
        randomCircleInArea: function (area, randomizeAlpha, addCross, borderColor, borderThickness, randomRadialProps) {
            let props, circle;
            
            props = (randomRadialProps) ? randomRadialProps : draw.randomRadialProps(area);
            
            if (addCross) {
                // always make sure the cross is visible - it won't be if randomizeAlpha is false //
                randomizeAlpha = true;
                circle = draw.line(-(props.radius), 0, props.radius, 0, borderColor  || '#000', 2);
                draw.line(0, -(props.radius), 0, props.radius, borderColor || '#000', 2, circle);
            }
            
            if (borderColor && !borderThickness) { borderThickness = 1; }
            
            // first draw the circle's border - don't use stroke //
            circle = draw.circle(props.radius+borderThickness, borderColor, null, null, null, null, circle);
            draw.circle(props.radius, props.color, null, null, null, null, circle);
            circle.x = props.x;
            circle.y = props.y;
            
            if (randomizeAlpha) {circle.alpha = Math.random(); }
            
            return circle;
        },
        
        /**
         * randomRadialProps: Generates random radial properties within an area for a TYPE_CIRCULAR shape.
         * @param {Object} area: An Object with x, y, width and height properties.
         * @param {Number} radiusMin: The minimum radius value.
         * @param {Number} radiusMax: The maximum radius value.
         * @param {Number} redMax: The maximum red value, between 0 and 255.
         * @param {Number} greenMax: The maximum green value, between 0 and 255.
         * @param {Number} blueMax: The maximum blue value, between 0 and 255.
         */
        randomRadialProps: function (area, radiusMin, radiusMax, redMax, greenMax, blueMax) {
            return {
                radius: randomIntBetween(radiusMin || 5, radiusMax || 20),
                color: randomColor(redMax || 255, greenMax || 255, blueMax || 255),
                x: (area ? randomIntBetween(area.x || 0, area.width) : 0),
                y: (area ? randomIntBetween(area.y || 0, area.height) : 0)
            };
        },
        
        /**
         * bitmap: Returns a clone of a Bitmap, using the src as the source.
         * @param {CanvasImageSource | String | Object} src: The source for the Bitmap data.
         * @param {Number} x: The x position of the Bitmap.
         * @param {Number} y: The y position of the Bitmap.
         */
        bitmap: function(src, x, y) {
            const bitmap = new createjs.Bitmap(src);
            bitmap.x = x;
            bitmap.y = y;
            return bitmap;
        },
        
        /**
         * textfield: builds a CreateJS Text.
         * @param {String} text: A hexidecimal number, the color of the text.
         * @param {String} sizeAndFont: The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial").
         * @param {String} colr: A hexidecimal number, the color of the text.
         * @param {String} align: Any of "start", "end", "left", "right", and "center".
         * @param {String} baseline: Any of "top", "hanging", "middle", "alphabetic", "ideographic", or "bottom".
         * @param {Number} x: The x position of the Text.
         * @param {Number} y: The y position of the Text.
         * @return {Text} The Text.
         */
        textfield: function (text, sizeAndFont, color, align, baseline, x, y) {
            const tf = new createjs.Text(text, sizeAndFont || "15px Arial", color || "#666666");
            tf.textBaseline = baseline || "top";
            tf.textAlign = align || "center";
            tf.x = x;
            tf.y = y;
            return tf;
        },
        
        randomColor: randomColor,
        randomRGBRange: randomRGBRange,
        
        getStartPointX: getStartPointX,
        getStartPointY: getStartPointY,
        getEndPointX: getEndPointX,
        getEndPointY: getEndPointY,
        
        blurFilterOn: blurFilterOn,
        
        /**
         * fps: Builds an updateable CreateJS Text to calculate and display fps.
         * @param {String} color: A hexidecimal number, the color of the text.
         * @return {TextField} A CreateJS Text.
         */
        fps: function (color = '#FFF') {
            const 
                textfield = new createjs.Text("-- fps", "bold 30px Arial", color),
                fps = new createjs.Container();
            fps.textfield = textfield;
            fps.addChild(textfield);
            fps.update = function (parent) {
                textfield.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
            };
            return fps;
        }
    };
    
    window.opspark.draw = draw;

}(window));