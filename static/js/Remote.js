'use strict';

var remote = (function (cache) {
  /**
   * Sends ajax request to the server.
   */
  function sendRequest(params) {
    return $.get({
      url: "/calc",
      data: params
    }).fail(function (err) {
      console.log("Ajax request failed: " + err)
    });
  }

  /**
   * Retrieves the given operation result either from the cache or from the server.
   */
  function calculate(arg1, op, arg2) {
    var cachedResult = cache.calculate(arg1, op, arg2);

    if (cachedResult !== undefined) {
      return Promise.resolve(cachedResult);
    }

    var remotePromise = sendRequest({arg1: arg1, op: op, arg2: arg2});
    return new Promise(function (resolve, reject) {
      remotePromise.done(function (value) {
        cache.save(arg1, op, arg2, value);
        resolve(value);
      });
    });
  }

  /**
   * Wraps the async call for lazy evaluation.
   */
  function calculateLazy(...args) {
    return function () {
      return calculate(...args);
    };
  }

  return {
    calculate: calculate,
    calculateLazy: calculateLazy
  }
})(cache);
