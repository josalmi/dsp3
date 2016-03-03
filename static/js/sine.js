'use strict';

var sine = (function (calculate) {
  function factorial(x) {
    if (x == 0) return 1.0;

    return factorial(x - 1) * x;
  }

  function sine(x, degree) {
    var val = 0.0;
    var pos = true;

    for (var i = 1; i <= degree; i += 2) {
      var term = (Math.pow(x, i) / factorial(i)) * (pos ? 1.0 : -1.0);

      pos = !pos;
      val += term;
    }

    return val;
  }

  function allPromises(a) {
    return $.when.apply($, a).then(function () {
      return Array.prototype.slice.call(arguments).map(function (t) {
        return t[0];
      })
    })
  }

  function remoteSine(x, degree, cb) {
    var promises = [];

    for (var i = 1; i <= degree; i += 2) {
      promises.push(remote.calculate(x, 'pow', i));
      promises.push(remote.calculate(i, 'fac'));
    }

    allPromises(promises).then(function (res) {
      var terms = [];
      for (var i = 0; i < res.length; i += 2) {
        terms.push(remote.calculate(res[i], '/', res[i + 1]));
      }

      return allPromises(terms);
    }).then(function (terms) {
      var pos = false;

      for (var i = 1; i < terms.length; i += 2) {
        terms.splice(i, 0, (pos ? '+' : '-'));
        pos = !pos;
      }

      calculate(terms, cb)
    });
  }

  return {
    remoteSine: remoteSine,
    sine: sine
  }
})(app.calculate);
