'use strict';

var cache = (function () {
  var cachedOperationsMap = new Map();
  var currentIndex = 0;

  // Initial cache size
  var cacheSize = 100;

  function constructKey(...args) {
    return args.join('');
  }

  function calculate(...args) {
    var value = cachedOperationsMap.get(constructKey(...args));
    save(...args, value);
    return value;
  }

  function save(arg1, op, arg2, value) {
    var key = constructKey(arg1, op, arg2); 
    cachedOperationsMap.delete(key);
    cachedOperationsMap.set(key, value);
    removeOldest();
  }

  function removeOldest() {
    while (cachedOperationsMap.size > cacheSize) {
     cachedOperationsMap.delete(cachedOperationsMap.keys().next().value); 
    }
  }

  function changeSize(size) {
    var oldSize = cacheSize;
    cacheSize = Number(size);

    if (cacheSize < oldSize) {
      removeOldest();
    }

  }

  return {
    calculate: calculate,
    save: save,
    changeSize: changeSize,
  }
})();
