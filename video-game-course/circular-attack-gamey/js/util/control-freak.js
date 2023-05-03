(function(window) {
  const opspark = window.opspark || {};
  
  /**
   * If active, listens for keydown events
   * and maps  keyboard event.code values. 
   * Clients can query on each tick using 
   * isActive(keyCode) to determine if keys 
   * are pressed during the current tick.
   * 
   * Returns the controlFreak API.
   */
  opspark.controlFreak = function() {
    const
      KEY_SLASHF = 'Slash',
      KEY_SPACE = 'Space',
      KEY_UP = 'ArrowUp',
      KEY_DOWN = 'ArrowDown',
      KEY_LEFT = 'ArrowLeft',
      KEY_RIGHT = 'ArrowRight',
      KEY_W = 'KeyW',
      KEY_A = 'KeyA',
      KEY_D = 'KeyD',
      KEY_E = 'KeyE',
      KEY_SHIFT_LEFT = 'ShiftLeft',
      activeKeys = {},
      API = Object.assign({
        activate,
        deactivate,
        isActive,
        destroy,
      });
      
      function activate() {
        document.onkeydown = document.onkeyup = onKeyActivity;
        return API;
      }

      function deactivate() {
        document.onkeydown = document.onkeyup = null;
        return API;
      }
      
      function onKeyActivity(event) {
        // be safe with old browsers //
        event = event || window.event;
        
        // set state of key press to true or false //
        activeKeys[event.code] = event.type === 'keydown';

        if (event.type === 'keydown') onKeyDown(event);
      }
      
      function onKeyDown(e) {
        /*
         * Prevent bubbling on the keydown event 
         * on arrow keys during game play - they 
         * cause the window to scroll.
         */
        if(activeKeys[KEY_SPACE] || 
           activeKeys[KEY_UP] ||
           activeKeys[KEY_LEFT] ||
           activeKeys[KEY_RIGHT]) { 
             e.preventDefault();
             e.stopPropagation(); 
           }
      }
      
      function isActive(keyCode) {
        return activeKeys[keyCode];
      }
      
      function destroy() {
        this.clearHandlers();
      }
      
      /*
       * For convenience, create a simple map of 
       * standard gaming keys. Using variables instead 
       * of Strings to reference keys will throw runtime
       * errors if misspelled, whereas Strings will silently
       * fail. Also, clients using the control freak module
       * won't need to change their code if we switched the
       * the implementation to use event.key instead event.code.
       */
      API.KEYS = {
        SPACE: KEY_SPACE,
        SLASHF: KEY_SLASHF,
        UP: KEY_UP,
        LEFT: KEY_LEFT,
        RIGHT: KEY_RIGHT,
        W: KEY_W,
        A: KEY_A,
        D: KEY_D,
        E: KEY_E,
        SHIFT_LEFT: KEY_SHIFT_LEFT,
      };
      
      return API;
  };
}(window));
