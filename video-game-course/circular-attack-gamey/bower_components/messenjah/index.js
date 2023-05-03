(function (window) {

  // use the opspark namespace //
  const opspark = window.opspark = window.opspark || {};
    
  // create the factory namespace //
  const factory = opspark.factory = opspark.factory || {};

  factory.dispatcher = function() {
    let map = {};
    
    function addMaybe(type, callback, times = -1) {
      const callbacks = map[type];
      if(callbacks) {
        if(!has(type, callback)) callbacks.push({ callback, times });
      } else {
        map[type] = [{ callback, times }];
      }
    }
    
    function on(type, callback) {
      if(typeof callback !== 'function') throw new TypeError('The callback param must be a Function!');
      addMaybe(type, callback);
      return this;
    }
    
    function once(type, callback) {
      if(typeof callback !== 'function') throw new TypeError('The callback param must be a Function!');
      addMaybe(type, callback, 1);
      return this;
    }
    
    function off(type, callback) {
      const callbacks = map[type];
      if(callbacks) {
        for (let i = 0; i < callbacks.length; i++) {
          const entry = callbacks[i];
          if(entry.callback === callback) {
            callbacks.splice(i, 1);
            break;
          }
        }
      }
      return this;
    }
    
    function has(type, callback = undefined) {
      const callbacks = map[type];
      if(callbacks && typeof callback === 'function') {
        for(let i = 0; i < callbacks.length; i++) {
          const entry = callbacks[i];
          if(entry.callback === callback) return true;
        }
        return false;
      }
      return callbacks && callbacks.length ? true : false;
    }
    
    function dispatch(event) {
      const callbacks = map[event.type];
      if(callbacks) {
        const survivors = [];
        callbacks.forEach(function(entry) {
          entry.callback(event);
          if(entry.times !== 1) survivors.push(entry); 
        });
        map[event.type] = survivors;
      }
      return this;
    }
    
    function clearHandlers() {
      map = {};
      return this;
    }
    
    // return the api //
    return {
      on,
      once, 
      off,
      has,
      dispatch,
      clearHandlers,
    };
  };
  
}(window));