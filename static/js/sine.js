'use strict';

var sine = (function (calculate) {
  function factorial(x) {
    if (x == 0) return 1.0;

    return factorial(x - 1) * x;
  }

  function localSine(x, degree, cb) {
    var val = 0.0;
    var pos = true;

    for (var i = 1; i <= degree; i += 2) {
      var term = (Math.pow(x, i) / factorial(i)) * (pos ? 1.0 : -1.0);

      pos = !pos;
      val += term;
    }

    cb(val);
  }

  function remotePow(x, n, c, res) {
    if(n == 0) {
      return 1;
    }

    if(n == 1) {
      return x;
    }

    if(c == n) {
      return res;
    }

    return remote.calculate(res, '*', x).then(function(result) {
      return remotePow(x, n, c + 1, result)
    });
  }

  function remoteSine(x, degree, cb) {
    var promises = [];

    for (var i = 1; i <= degree; i += 2) {
      //promises.push(remote.calculate(x, 'pow', i));
      promises.push(remotePow(x, i, 0, 1));
      promises.push(remote.calculate(i, 'fac'));
    }

    Promise.all(promises).then(function (res) {
      var terms = [];
      for (var i = 0; i < res.length; i += 2) {
        terms.push(remote.calculate(res[i], '/', res[i + 1]));
      }

      return Promise.all(terms);
    }).then(function (terms) {
      var pos = false;

      for (var i = 1; i < terms.length; i += 2) {
        terms.splice(i, 0, (pos ? '+' : '-'));
        pos = !pos;
      }

      calculate(terms, cb)
    });
  }

  function drawPoint(ctx, x, y) {
    var xScale = Math.floor(canvas.width / 6.3);
    var yScale = 125;
    var pointSize = 5;
    ctx.fillRect(canvas.width / 2 + x * xScale, canvas.height / 2 + -y * yScale, pointSize, pointSize);
  }

  function plotLocal(calculateLocally, ctx) {
    var sineCalculator;
    if (calculateLocally) {
      sineCalculator = function(x, degree, cb) {
        localSine(x, degree, function(y) {
          cb(x, y);
        });
      }
    } else {
       sineCalculator = function(x, degree, cb) {
        remoteSine(x, degree, function(arg1, op, arg2, y, terms) {
          if (terms.length > 0) {
            return;
          }
          cb(x, y);
        });
      }
    }
    for (var i = -Math.PI; i <= Math.PI; i += 0.1) {
      sineCalculator(i, 15, function(x, y) {
        drawPoint(ctx, x, y);
      });
    }
  }

  function plotRemote(ctx, str) {
    var drawing = new Image();
    drawing.src = '/sine?str=' + encodeURIComponent(str);
    drawing.onload = function() {
       ctx.drawImage(drawing,0,0);
    };
  }

  function plot(str) {
    var mode = $("input[name='sineMode']:checked").val();
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mode === 'remotePlot') {
      plotRemote(ctx, str);
    } else {
      var calculateLocally = mode === 'localCalculate';
      plotLocal(calculateLocally, ctx);
    }
  }

  return {
    plot,
    remotePow,
    remoteSine
  }
})(app.calculate);
