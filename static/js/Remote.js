'use strict';

var remote = (function (cache) {
  var requests = 0;

  var operators = {
    '+': function (arg1, arg2) {
      return arg1 + arg2;
    },
    '-': function (arg1, arg2) {
      return arg1 - arg2;
    },
    '*': function (arg1, arg2) {
      return arg1 * arg2;
    },
    '/': function (arg1, arg2) {
      return arg1 / arg2;
    }
  };

  function calculateLocal(arg1, op, arg2) {
    var operator = operators[op];

    return operator(parseFloat(arg1), parseFloat(arg2));
  }

  /**
   * Sends ajax request to the server.
   */
  function sendRequest(params) {
    requests += 1;

    //var res = calculateLocal(params.arg1, params.op, params.arg2);
    //return Promise.resolve(res);

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
      remotePromise.then(function (value) {
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

  /**
   * Returns the current request count.
   */
  function getRequests() {
    return requests;
  }

  /**
   * Resets the request counter.
   */
  function resetRequests() {
    requests = 0;
  }

  return {
    calculate,
    calculateLazy,
    getRequests,
    resetRequests
  }
})(cache);
