'use strict';

/* Authors:
Miko Mynttinen, 014242634
Joni Salmi, 014341137
*/

var restify = require('restify');
var exec = require('child_process').exec;

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

server.get('/sine', function (req, res, next) {
  var cmd = 'gnuplot -e "set terminal png size 300, 300; set xrange [-3.14:3.14]; unset border; unset key; plot ' + req.query.str + ';"';
  console.log(cmd);

  exec(cmd, {encoding: 'binary'}, function (err, stdout) {
    res.writeHead(200, {'Content-Type': 'image/png'});
    res.end(stdout, 'binary');
    return next();
  });
});

server.get(/.*/, restify.serveStatic({
  directory: __dirname + '/static',
  default: 'index.html'
}));

server.listen(31337, function () {
  console.log('%s listening at %s', server.name, server.url);
});
