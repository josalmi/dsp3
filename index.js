'use strict';

var restify = require('restify');

var operators = {
  '+': function (arg1, arg2) {
    return arg1 + arg2;
  },
  '-': function (arg1, arg2) {
    return arg1 - arg2;
  },
  '*': function (arg1, arg2) {
    return arg1 * arg2;
  },
  '/': function (arg1, arg2) {
    return arg1 / arg2;
  }
};

function pow(x, n) {
  if(n == 0) return 1.0;

  var val = 1.0;
  for(var i = 0; i < n; ++i) {
    val = val*x;
  }

  return val;
}

function factorial(x) {
  if(x == 0) return 1.0;

  return factorial(x - 1) * x;
}

function sine(x, degree) {
  var val = 0.0;
  var pos = true;

  for(var i = 1; i <= degree; i += 2) {
    var term = (pow(x, i) / factorial(i)) * (pos ? 1.0 : -1.0);

    pos = !pos;
    val += term;
  }

  return val;
}

function respond(req, res, next) {
  var arg1 = parseFloat(req.query.arg1);
  var op = req.query.op;
  var arg2 = parseFloat(req.query.arg2);
  var operator = operators[op];

  if (!operator) {
    res.send(op);
    return next();
  }

  res.send(200, operator(arg1, arg2));
  next();
}

var server = restify.createServer({});
server.use(restify.queryParser());

server.get('/calc', respond);
server.get(/.*/, restify.serveStatic({
  directory: __dirname + '/static',
  default: 'index.html'
}));

console.log("sine(1) ~ " + sine(1, 15));

server.listen(31337, function () {
  console.log('%s listening at %s', server.name, server.url);
});
