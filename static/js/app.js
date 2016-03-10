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

  function calculateNext(terms, cb) {
    if (terms.length < 3) return;

    var arg1 = terms.shift();
    var op = terms.shift();
    var arg2 = terms.shift();

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

  function simplifyParsed(terms, cb) {
    calculateNext(terms, function (arg1, op, arg2, resp, terms) {
      addResult(arg1 + op + arg2 + " = " + resp);
      cb(terms, resp);
    });
  }

  function simplify(str) {
    var terms = parser.parse(str.trim());
    simplifyParsed(terms, function (terms, resp) {
      input.value = [resp, terms.join(' ')].filter(Boolean).join(' ');
    })
  }

  return {
    addResult: addResult,
    calculate: calculate,
    parseAndCalculate: parseAndCalculate,
    simplify: simplify,
  }
})();
