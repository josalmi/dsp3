'use strict';

var app = (function () {
  function addResult(result) {
    var e = $("<p/>",
      {text: result}
    );

    $("#results").append(e)
  }

  function clearResults() {
    $("#results").children("p").remove();
  }

  function calculate(terms, cb) {
    if (terms.length < 3) return;

    var arg1 = terms.shift();
    var op = terms.shift();
    var arg2 = terms.shift();

    remote.calculate(arg1, op, arg2).done(function (resp) {
      if (cb) {
        cb(arg1, op, arg2, resp, terms.length);
      }

      terms.unshift(resp);
      calculate(terms, cb);
    });
  }

  function parseAndCalculate(str) {
    var terms = parser.parse(str.trim());
    if (terms.length < 3) return;

    clearResults();
    calculate(terms, function (arg1, op, arg2, resp) {
      addResult(arg1 + op + arg2 + " = " + resp);
    });
  }

  return {
    addResult: addResult,
    calculate: calculate,
    parseAndCalculate: parseAndCalculate
  }
})();

$(document).ready(function () {
  console.log(sine.sine(2, 15));
  sine.remoteSine(2, 15, function (arg1, op, arg2, resp, len) {
    if (len == 0) {
      app.addResult("sine(2) ~ " + resp);
    }
  });
});