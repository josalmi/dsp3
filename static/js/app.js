'use strict';

var app = {};

function addResult(result) {
  var e = $("<p/>",
    {text: result}
  );

  $("#results").append(e)
}

function parse(query) {
  // TODO: Parse query into array of { arg1, arg2, op } triplets
  console.log(query);
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

function calculate(query) {
  var params = parse(query);

  sendQuery(params).done(function (resp) {
    console.log(resp);
    addResult(query + " = " + resp);
  });
}

$(document).ready(function () {
  app.calculate = calculate;
});