'use strict';

/* Authors:
 Miko Mynttinen, 014242634
 Joni Salmi, 014341137
 */

var parser = (function () {
  /**
   * Appends only non-empty strings s into the given array a.
   */
  function pushNonEmpty(a, s) {
    if (s.length > 0) a.push(s);
  }

  /**
   * Parses the given string str into an array of operators and numeric terms.
   */
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
    parse
  }
})();