'use strict';

var parser = (function () {
  function pushNonEmpty(a, s) {
    if (s.length > 0) a.push(s);
  }

  function parse(str) {
    var terms = [];
    var term = "";

    for (var i = 0; i < str.length; ++i) {
      var c = str[i];

      if ($.isNumeric(c)) {
        term += c;
      }

      if (c.match(/[+-/*]/)) {
        pushNonEmpty(terms, term);
        terms.push(c);
        term = "";
      }
    }

    pushNonEmpty(terms, term);
    return terms;
  }

  return {
    parse: parse
  }
})();