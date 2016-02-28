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

  console.log(terms);
  console.log(str);

  return {arg1: '1', arg2: '2', op: '+'}
}

function sendQuery(params) {
  return $.get({
    url: "/calc",
    data: params
  }).fail(function () {
    console.log("Ajax request failed.")
  });
}

function calculate(str) {
  var params = parse(str.trim());

  sendQuery(params).done(function (resp) {
    console.log(resp);
    addResult(str + " = " + resp);
  });
}

$(document).ready(function () {
  app.calculate = calculate;
});