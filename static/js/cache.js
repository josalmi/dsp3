'use strict';

var cache = (function () {
  var cachedOperationsMap = new Map();

  // Initial cache size
  var cacheSize = 100;

  /**
   * Builds the cache hashmap key.
   */
  function constructKey(...args) {
    return args.join('');
  }

  /**
   * Retrieves the given expression from the cache.
   */
  function calculate(...args) {
    var value = cachedOperationsMap.get(constructKey(...args));
    if (value !== undefined) {
      save(...args, value);
    }
    return value;
  }

  /**
   * Saves the given expression and value into the cache.
   */
  function save(arg1, op, arg2, value) {
    var key = constructKey(arg1, op, arg2);
    cachedOperationsMap.delete(key);
    cachedOperationsMap.set(key, value);
    removeOldest();
  }

  /**
   * Removes the oldest cache entry.
   */
  function removeOldest() {
    while (cachedOperationsMap.size > cacheSize) {
      cachedOperationsMap.delete(cachedOperationsMap.keys().next().value);
    }
  }

  /**
   * Sets the cache size.
   */
  function changeSize(size) {
    var oldSize = cacheSize;
    cacheSize = Number(size);

    if (cacheSize < oldSize) {
      removeOldest();
    }

  }

  /**
   * Clears the cache.
   */
  function clearCache() {
    cachedOperationsMap.clear();
  }

  /**
   * Returns the cache size.
   */
  function getCacheSize() {
    return cacheSize;
  }

  return {
    calculate,
    save,
    changeSize,
    clearCache,
    getCacheSize
  }
})();
