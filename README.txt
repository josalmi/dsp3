Distributed Systems Project: Assignment 3
=========================================

Team
----
Miko Mynttinen, 014242634
Joni Salmi, x


Tasks
-----

Miko:
- Cache size / request plot
- Expression string parsing
- Factorial, pow, sine calculation
- HTML
- Documentation

Joni:
- Cache
- Server
- Simplification
- Sine plotting


Requirements
------------
- Reasonably recent Node.js installation.
- Google Chrome or Mozilla Firefox


How to run
----------
Execute the following commands:
```
npm install
node index.js
```
Navigate to http://localhost:31337


Implementation
--------------
The server uses restify REST library to respond to the HTTP requests. The code is very simple and only 60 lines.

The front-end application is organized using the module pattern. Application, sine calculation, cache, expression parsing and remote modules are used. This results in a straight-forward program code that works as follows: The application module requests a calculation result from the remote module, which queries the cache module for an answer. If the cache misses, the network request is sent.

- Cache is implemented using a hashmap. The mode of operation is LRU.
- Network requests use JQuery and promises.
- Expressions are parsed into an array of terms and operators, which is then recursively processed.
- Sine is calculated using the Taylor series.


Cache size / sent requests graph
--------------------------------
See graph.png and graph.ods.