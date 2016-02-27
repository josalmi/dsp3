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

server.listen(31337, function () {
  console.log('%s listening at %s', server.name, server.url);
});
