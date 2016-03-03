'use strict';

var remote = (function () {
  function sendRequest(params) {
    return $.get({
      url: "/calc",
      data: params
    }).fail(function (err) {
      console.log("Ajax request failed: " + err)
    });
  }

  function calculate(arg1, op, arg2) {
    return sendRequest({arg1: arg1, op: op, arg2: arg2})
  }

  return {
    calculate: calculate
  }
})();
