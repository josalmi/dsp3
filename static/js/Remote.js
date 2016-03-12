'use strict';

var remote = (function (cache) {
  function sendRequest(params) {
    return $.get({
      url: "/calc",
      data: params
    }).fail(function (err) {
      console.log("Ajax request failed: " + err)
    });
  }

  function calculate(arg1, op, arg2) {
    var cachedResult = cache.calculate(arg1, op, arg2);

    if(cachedResult !== undefined) {
      return Promise.resolve(cachedResult);
    }

    var remotePromise = sendRequest({arg1: arg1, op: op, arg2: arg2});
    return new Promise(function(resolve, reject) {
      remotePromise.done(function(value) {
        cache.save(arg1, op, arg2, value);
        resolve(value);
      });
    });
  }

  function calculateLazy(...args) {
    return function() {
      return calculate(...args);
    };
  }


  function sine() {
    return '/sine'
  }

  return {
    calculate: calculate,
    calculateLazy: calculateLazy,
    sine: sine,
  }
})(cache);
