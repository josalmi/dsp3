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
    var cacheResult = cache.calculate(arg1, op, arg2);
    if (cacheResult !== undefined) {
      return Promise.resolve(cacheResult);
    }
    var remotePromise = sendRequest({arg1: arg1, op: op, arg2: arg2});
    return new Promise(function(resolve, reject) {;
      remotePromise.done(function(value) {
        cache.save(arg1, op, arg2, value);
        resolve(value);
      });
    });
  }

  function sine() {
    return '/sine'
  }

  return {
    calculate: calculate,
    sine: sine,
  }
})(cache);
