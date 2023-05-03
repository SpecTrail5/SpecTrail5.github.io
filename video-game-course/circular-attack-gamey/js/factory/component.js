(function(opspark, createjs, draw, _) {
  const HORIZONTAL = 'HORIZONTAL';
  const VERTICAL = 'VERTICAL';
  const GRID = 'GRID';
  
  const CENTER = 'CENTER';
  const RIGHT = 'RIGHT';
  const LEFT = 'LEFT';

  // BUTTON //
  _.set(opspark, 'factory.component.button',
    function(text, colorUp = '#5cb85c', colorOver = '#4cae4c', scaleWidthToParent = false) {
      const
        container = new createjs.Container(),
        textfield = draw.textfield(text, 'bold 25px Arial', '#FFF', 'left'),
        textfieldBounds = textfield.getBounds();

      let
        background,
        width = textfieldBounds.width + 36;

      // call render the first time //
      render(colorUp, colorOver);

      function render(colorUp, colorOver) {
        container.removeAllChildren();
        // roundRect: (width, height, radius, color, strokeColor, strokeStyle, xOffset, yOffset, onShape)
        background = draw.roundRect(width,
          textfieldBounds.height + 20,
          4,
          colorUp,
          colorOver,
          1);
        textfield.x = 18;
        textfield.y = 12;
        container.addChild(background, textfield);
      }

      function rerenderBackground(colorUp, colorOver) {
        draw.roundRect(width,
          textfieldBounds.height + 20,
          4,
          colorUp,
          colorOver,
          1, null, null, background);
      }

      // mouse over //
      background.on('mouseover', onMouseOver);

      function onMouseOver(event) {
        background.cursor = 'pointer';
        rerenderBackground(colorOver, colorOver);
      }

      // mouse out //
      background.on('mouseout', onMouseOut);

      function onMouseOut(event) {
        rerenderBackground(colorUp, colorOver);
      }

      container.on('added', onAdded);

      function onAdded(event) {
        container.off('added', onAdded);
        if (scaleWidthToParent) {
          // get the parent width, offset by 20 for padding //
          width = container.parent.getBounds().width - 20;
          textfield.x = (width / 2 - textfield.getBounds().width / 2);
          rerenderBackground(colorUp, colorOver);
        }
      }

      return container;
    });


  // LAYOUT //
  function render(children, content, padding, direction, align) {
    let distance = 0;
    switch (direction) {
      case HORIZONTAL:
        children.forEach(function(child, i) {
          child.x = distance + i * padding;
          content.addChild(child);
          distance += child.getBounds().width;
        });
        break;

      case VERTICAL:
        children.forEach(function(child, i) {
          child.y = distance + i * padding;
          content.addChild(child);
          if(align === CENTER) {
            const
              wChild = child.width || child.getBounds().width,
              wParent = content.getBounds().width || 0;
            if(wChild < wParent - padding * 2) child.x = (wParent - wChild) / 2 - padding;
          }
          distance += child.getBounds().height;
        });
        break;

      case GRID:
        throw new Error('Grid layout not implemented');
        // children.forEach(function(child, i) {

        // });
        // break;

      default:
        // code
    }
    // return the layout instance //
    return this;
  }

  function layout({ children = [], direction = 'HORIZONTAL', align, padding = 10, background, area }) {
    const
      asset = new createjs.Container(),
      content = new createjs.Container();

    // use inner Container content to create border padding //
    content.x = content.y = padding;
    
    /*
     * If we have a background, create an invisible background of the same size,
     * offset for padding, and add it to the contents. This will allow buttons 
     * to resize themselves to their parent, the contents Container.
     */
    if(background) {
      asset.addChild(background);
      const
        backgroundWidth = background.width || background.getBounds().width,
        backgroundHeight = background.height || background.getBounds().height,
        backgroundContent = draw.rect(backgroundWidth,
          backgroundHeight,
          '#CCC');
        backgroundContent.alpha = 0;
        backgroundContent.x = backgroundContent.y = -10;
        content.addChild(backgroundContent);
    }
    asset.addChild(content);

    // render first time //
    render(children, content, padding, direction, align);

    return _.assign(asset, {
      render() {
        // re-render using the orig layout settings //
        render(children, content, padding, direction, align);
      },
      padding,
      direction,
      align,
      add(...added) {
        children.push(...added);
        content.addChild(...added);
        render(children, content, padding, direction, align);
      },
      remove(...removed) {
        _.each(removed, child => {
          const index = children.indexOf(child);
          if (index > -1) children.splice(index, 1);
        });
        content.removeChild(...removed);
        render(children, content, padding, direction, align);
      }
    });
  }
  _.assign(layout, { HORIZONTAL, VERTICAL, GRID, CENTER, RIGHT, LEFT });
  _.set(opspark, 'factory.component.layout', layout);

}(window.opspark, window.createjs, window.opspark.draw, window._));
