'use strict';

var app = (function () {
  /**
   * Adds the given result to the results div.
   */
  function addResult(result) {
    var e = $("<p/>",
      {text: result}
    );

    $("#results").append(e)
  }

  /**
   * Clears results.
   */
  function clearResults() {
    $("#results").children("p").remove();
  }

  /**
   * Retrieves the next cache result, if one exists.
   */
  function simplifyNext(arg1, op, arg2) {
    return cache.calculate(arg1, op, arg2);
  }

  /**
   * Calculates the next result, if terms has atleast three elements left.
   */
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

  /**
   * Recursively calculates the expression represented as an array.
   */
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

  /**
   * Parses the expression and calculates it.
   */
  function parseAndCalculate(str) {
    if (/(sin|cos|tan)/.test(str)) {
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

  /**
   * Simplifies the expression by fetching the leftmost sub-expression result from the cache.
   */
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

  var cacheSize = 0;
  var maxCacheSize = 2000;

  /**
   * Generates the cache/request graph data.
   */
  function generateGraphData() {
    if (cacheSize > maxCacheSize) return;

    remote.resetRequests();
    cache.changeSize(cacheSize);
    cache.clearCache();
    sine.plot();
    cacheSize += 1;
  }

  return {
    addResult,
    calculate,
    parseAndCalculate,
    simplify,
    generateGraphData
  }
})();
