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

  function simplifyNext(arg1, op, arg2) {
    return cache.calculate(arg1, op, arg2);
  }

  function calculateNext(terms, cb) {
    if (terms.length < 3) return;

    var arg1 = terms.shift();
    var op = terms.shift();
    var arg2 = terms.shift();

    var cacheResult = simplifyNext(arg1, op, arg2);
    if (cacheResult !== undefined) {
     cb(arg1, op, arg2, cacheResult, terms);
     return;
    }

    remote.calculate(arg1, op, arg2).then(function (resp) {
      if (cb) {
        cb(arg1, op, arg2, resp, terms);
      }
    });
  }

  function calculate(terms, cb) {
    function calculateCb(arg1, op, arg2, resp, terms) {
      cb(arg1, op, arg2, resp, terms);
      if (terms.length > 0) {
        terms.unshift(resp);
        calculateNext(terms, calculateCb);
      }
    }
    calculateNext(terms, calculateCb);
  }

  function parseAndCalculate(str) {
    var terms = parser.parse(str.trim());

    if (terms.length === 1 && terms[0] === 'sin') {
      sine.plot();
      return;
    }
    if (terms.length < 3) return;

    clearResults();
    calculate(terms, function (arg1, op, arg2, resp) {
      addResult(arg1 + op + arg2 + " = " + resp);
    });
  }

  function simplify(str) {
    var terms = parser.parse(str.trim());
    if (terms.length < 3) return;
    var arg1 = terms.shift();
    var op = terms.shift();
    var arg2 = terms.shift();

    var value = simplifyNext(arg1, op, arg2);
    if (value !== undefined) {
      addResult(arg1 + op + arg2 + " = " + value);
      input.value = [value, terms.join(' ')].filter(Boolean).join(' ');
    }
  }

  return {
    addResult: addResult,
    calculate: calculate,
    parseAndCalculate: parseAndCalculate,
    simplify: simplify,
  }
})();
