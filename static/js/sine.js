'use strict';

/* Authors:
 Miko Mynttinen, 014242634
 Joni Salmi, 014341137
 */

var sine = (function (calculate, generateGraphData) {
  /**
   * Returns the factorial for x.
   */
  function factorial(x) {
    if (x == 0) return 1.0;

    return factorial(x - 1) * x;
  }

  /**
   * Calculates the sine locally.
   */
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

  /**
   * Splits the pow call into remote multiplications.
   */
  function remotePow(x, n, c, res) {
    return function () {
      if (n == 0) {
        return Promise.resolve(1);
      }

      if (n == 1) {
        return Promise.resolve(x);
      }

      if (c == n) {
        return Promise.resolve(res);
      }

      return remote.calculate(res, '*', x).then(function (result) {
        return remotePow(x, n, c + 1, result)();
      });
    }
  }

  /**
   * Splits the factorial call into remote multiplications.
   */
  function remoteFactorial(x, res) {
    return function () {
      if (x == 0) return Promise.resolve(1.0);
      if (x == 1) return Promise.resolve(res);

      return remote.calculate(res, '*', x).then(function (result) {
        return remoteFactorial(x - 1, result)();
      });
    }
  }

  /**
   * Evaluates the given array of promises sequentially.
   */
  function promiseAllOrdered(promises, index) {
    if (index == promises.length) {
      return Promise.resolve([]);
    }

    return new Promise(function (resolve, reject) {
      promises[index]().then(function (value) {
        promiseAllOrdered(promises, ++index).then(function (res) {
          res.unshift(value);
          resolve(res);
        });
      });
    });
  }

  /**
   * Calculates the sine remotely.
   */
  function remoteSine(x, degree, cb) {
    var promises = [];

    // Calculate the factorial and pow for the terms.
    for (var i = 1; i <= degree; i += 2) {
      promises.push(remotePow(x, i, 0, 1.0));
      promises.push(remoteFactorial(i, 1.0));
    }

    // Divide the pow results with factorials and add the resulting terms together.
    promiseAllOrdered(promises, 0).then(function (res) {
      var terms = [];
      for (var i = 0; i < res.length; i += 2) {
        // Do the division remotely.
        terms.push(remote.calculateLazy(res[i], '/', res[i + 1]));
      }

      return promiseAllOrdered(terms, 0);
    }).then(function (terms) {
      var pos = false;
      for (var i = 1; i < terms.length; i += 2) {
        // Insert the operations for the addition.
        terms.splice(i, 0, (pos ? '+' : '-'));
        pos = !pos;
      }

      // Calculate the addition remotely.
      calculate(terms, cb)
    });
  }

  /**
   * Plots a single point.
   */
  function drawPoint(ctx, x, y) {
    var xScale = Math.floor(canvas.width / 6.3);
    var yScale = 125;
    var pointSize = 5;
    ctx.fillRect(canvas.width / 2 + x * xScale, canvas.height / 2 + -y * yScale, pointSize, pointSize);
  }

  /**
   * Plots the sine locally.
   */
  function plotLocal(calculateLocally, ctx) {
    var sineCalculator;
    if (calculateLocally) {
      sineCalculator = function (x, degree, cb) {
        localSine(x, degree, function (y) {
          cb(x, y);
        });
      }
    } else {
      sineCalculator = function (x, degree, cb) {
        remoteSine(x, degree, function (arg1, op, arg2, y, terms) {
          if (terms.length > 0) {
            return;
          }
          cb(x, y);

          /*
          if(x >= 3) {
            console.log(cache.getCacheSize() + "," + remote.getRequests());
            generateGraphData();
          }
          */
        });
      }
    }

    /**
     * Calculates the sine for the given bounds and step size.
     */
    function calculateRange(i, n, step, cb) {
      if (i >= n) return;
      sineCalculator(i, 15, function (x, y) {
        cb(x, y);
        calculateRange(i + step, n, step, cb);
      });
    }

    calculateRange(-Math.PI, Math.PI, 0.1, function (x, y) {
      drawPoint(ctx, x, y);
    });
  }

  /**
   * Draws the remotely plotted image onto the canvas.
   */
  function plotRemote(ctx, str) {
    var drawing = new Image();
    drawing.src = '/sine?str=' + encodeURIComponent(str);
    drawing.onload = function () {
      ctx.drawImage(drawing, 0, 0);
    };
  }

  /**
   * Plots the given expression str with the selected sine plotting mode.
   */
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
    plot
  }
})(app.calculate, app.generateGraphData);
