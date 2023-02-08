(function(window, opspark) {
  const draw = opspark.draw;

  /*
   * Creates an API at opspark.assets to 
   * build and work with visual assets.
   */
  window.opspark.assets = {
    makeShip(color) {
      const
        radius = 25,
        ship = draw.rect(radius, radius, color, null, null, -(radius + radius / 10), -(radius / 2));

      // continue to draw on the ship Shape to create our design //
      draw.circle(radius + 3, color, null, null, null, null, ship);
      draw.circle(radius, '#CCC', null, null, null, null, ship);
      draw.polyStar(radius, 3, 0, 0, color, null, null, null, null, ship);
      draw.circle(radius - 15, '#CCC', null, null, -5, null, ship);

      ship.rotation = 270;

      // rasterize the vector graphic, basically creating a bitmap //
      ship.snapToPixel = true;
      ship.cache(-radius - 10, -radius - 10, radius * 2 + 15, radius * 2 + 15);

      return ship;
    },
    // creates and returns a textfield //
    makeTextfield(text, sizeAndFont = "20px Arial", color = "#BBB") {
      return draw.textfield(text, sizeAndFont, color);
    },
    // this method updates the text on a textfield, then re-centers the textfield //
    updateText(textfield, text, canvas, offset = 50) {
      textfield.text = text;
      const textBounds = textfield.getBounds();
      
      // re-center the text each time it changes //
      textfield.x = (canvas.width) / 2;
      textfield.y = canvas.height / 2 + offset;
    }
  };
}(window, window.opspark));
