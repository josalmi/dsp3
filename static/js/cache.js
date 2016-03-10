'use strict';

var cache = (function () {
  var cachedOperations = [];
  var currentIndex = 0;

  // Initial cache size
  var cacheSize = 100;

  function calculate(arg1, op, arg2) {
    for (var i = 0; i < cachedOperations.length; i++) {
      var cachedOperation = cachedOperations[i];
      if (cachedOperation.arg1 === arg1 && cachedOperation.op === op && cachedOperation.arg2 === arg2) {
        return cachedOperation.value;
      }
    }
    return;
  }

  function save(arg1, op, arg2, value) {
    cachedOperations[currentIndex++ % cacheSize] = {arg1, op, arg2, value};
  }

  function changeSize(size) {
    size = Number(size);

    if ((size > cacheSize && currentIndex === cachedOperations.length) || size === cacheSize) {
      cacheSize = size;
      return;
    } else if (size !== 0) {
      var defragedCacheOperations = [];
      var newSize = Math.min(size, cachedOperations.length);
      for (var i = 0; i < newSize; i++) {
        defragedCacheOperations[newSize - i - 1] = cachedOperations[(currentIndex - i - 1) % cacheSize];
      }
      cachedOperations = defragedCacheOperations;
    } else {
      cachedOperations = [];
    }
    cacheSize = size;
    currentIndex = cachedOperations.length;
  }

  return {
    calculate: calculate,
    save: save,
    changeSize: changeSize,
  }
})();
