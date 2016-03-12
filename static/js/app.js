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
    sine.remoteSine(2, 15, function(res) {
      console.log(res)
    });
    /*
    var res = sine.remotePow(2, 8, 0, 1).then(function(res) {
      console.log("lol:" + res);
    });

    console.log(res);
    return;
    */

    if(/(sin|cos|tan)/.test(str)) {
      console.log(str);
      sine.plot(str);
      return;
    }

    var terms = parser.parse(str.trim());
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
    simplify: simplify
  }
})();
