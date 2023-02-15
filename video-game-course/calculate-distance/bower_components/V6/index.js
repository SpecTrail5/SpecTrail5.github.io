(function(window, createjs) {
  window.opspark = window.opspark || {};

  /**
   * V6: Returns an API wrapping a CreateJS gaming engine, with the CreateJS 
   * Stage initialized.
   * 
   * Supports both Stage and Stage GL, starting and stopping the tick, adding 
   * and removing tick handlers, and dynamic stage resizing.
   */
  window.opspark.V6 = function({ canvasId = 'canvas', useStageGL = false } = {}) {
    const
      canvas = document.getElementById(canvasId),
      resizeHanders = [setSizeCanvas],
      tickHandlers = [];

    let stage;
    if (useStageGL) {
      stage = new createjs.StageGL(canvas, { antialias: true });
      resizeHanders.push(setSizeViewport);
    }
    else {
      stage = new createjs.Stage(canvas);
    }

    createjs.Ticker.framerate = 60;

    let
      tickerHandler,
      isActiveResize = false;

    function onResize(event) {
      setSize();
    }

    function setSize() {
      const
        width = window.innerWidth,
        height = window.innerHeight;
      resizeHanders.forEach((handler) => handler(width, height));
    }

    function setSizeCanvas(width, height) {
      canvas.width = width;
      canvas.height = height;
    }

    function setSizeViewport(width, height) {
      stage.updateViewport(width, height);
      stage.update();
    }

    function onTick(event) {
      tickHandlers.forEach(tickHandler => tickHandler(event));
      stage.update();
    }

    return {
      activateTick() {
        if (tickerHandler) createjs.Ticker.off('tick', tickerHandler);
        tickerHandler = createjs.Ticker.on('tick', onTick);
        return this;
      },
      deactivateTick() {
        if (tickerHandler) createjs.Ticker.off('tick', tickerHandler);
        tickerHandler = null;
        return this;
      },
      activateResize() {
        // don't add another handler if resizing is already active //
        if (isActiveResize) return;

        window.addEventListener('resize', onResize);
        isActiveResize = true;
        setSize();
        return this;
      },
      deactivateResize() {
        window.removeEventListener('resize', onResize);
        isActiveResize = false;
        return this;
      },
      addTickHandlers(...onTickHandlers) {
        tickHandlers.push(...onTickHandlers);
        return this;
      },
      removeTickHandlers(...onTickHandlers) {
        onTickHandlers.forEach((tickHandler) => {
          const index = tickHandlers.indexOf(tickHandler);
          if (index > -1) tickHandlers.splice(index, 1);
        });
        return this;
      },
      isActiveResize() {
        return isActiveResize;
      },
      isActiveTick() {
        return Boolean(tickerHandler);
      },
      getCanvas() {
        return canvas;
      },
      getStage() {
        return stage;
      },
    };
  };
}(window, window.createjs));
