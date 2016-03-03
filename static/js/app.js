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

  function calculate(arg1, op, arg2, terms) {
    console.log("arg1: " + arg1 + " arg2: " + arg2 + " op: " + op);
    console.log("terms: " + terms);

    remote.calculate(arg1, op, arg2).done(function (resp) {
      console.log(resp);
      addResult(arg1 + op + arg2 + " = " + resp);

      if (terms.length < 2) return;

      calculate(resp, terms.shift(), terms.shift(), terms);
    });
  }

  function parseAndCalculate(str) {
    var terms = parser.parse(str.trim());
    if (terms.length < 3) return;

    clearResults();
    calculate(terms.shift(), terms.shift(), terms.shift(), terms);
  }

  return {
    calculate: parseAndCalculate
  }
})();


function sine(x, degree) {
  var val = 0.0;
  var pos = true;

  for (var i = 1; i <= degree; i += 2) {
    var term = (pow(x, i) / factorial(i)) * (pos ? 1.0 : -1.0);

    pos = !pos;
    val += term;
  }

  return val;
}

$(document).ready(function () {
});