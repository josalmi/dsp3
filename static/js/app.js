'use strict';

var app = {};

function addResult(result) {
  var e = $("<p/>",
    {text: result}
  );

  $("#results").append(e)
}

function parseSine(str) {
  return str.match("(sin|cos|tan)");
}

function parseOp(op) {
  return op.match(/[+-/*]/);
}

function pushNonEmpty(a, s) {
  if (s.length > 0) a.push(s)
}

function parse(str) {
  var sine = parseSine(str);
  if (sine) return [{op: sine[0]}];

  var terms = [];
  var term = "";

  for (var i = 0; i < str.length; ++i) {
    var c = str[i];

    if ($.isNumeric(c)) {
      term += c;
    }

    if (parseOp(c)) {
      pushNonEmpty(terms, term);
      terms.push(c);
      term = "";
    }
  }

  pushNonEmpty(terms, term);
  return terms;
}

function sendQuery(params) {
  return $.get({
    url: "/calc",
    data: params
  }).fail(function () {
    console.log("Ajax request failed.")
  });
}

function calculateRec(arg1, op, arg2, terms) {
  console.log("arg1: " + arg1 + " arg2: " + arg2 + " op: " + op);
  console.log("terms: " + terms);

  sendQuery({arg1: arg1, arg2: arg2, op: op}).done(function (resp) {
    console.log(resp);
    addResult(arg1 + op + arg2 + " = " + resp);

    calculateRec(resp, terms.shift(), terms.shift(), terms);
  });
}

function calculate(str) {
  var terms = parse(str.trim());
  calculateRec(terms.shift(), terms.shift(), terms.shift(), terms);
}

$(document).ready(function () {
  app.calculate = calculate;
});