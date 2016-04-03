'use strict';
var Promise = require('bluebird');

exports.purep = Promise.resolve;

exports.apply = function(fn) {
  return function(args) {
    return fn.apply(this, args);
  };
};

exports.curry2 = function(fn) {
  return function curried(a, b) {
    if (b === undefined) {
      return function(b, c) {
        if (c === undefined) {
          return fn(a, b);
        } else {
          return fn(a, b)(c);
        }
      };
    } else {
      return fn(a, b);
    }
  };
};

exports.id = function(a) {
  return a;
};

// > exports.always(1, 2)
// 1
// > exports.always(1)(2)
// 1
// > exports.always(exports.id)(1, 2)
// 2
// > exports.always(exports.id)(1)(2)
// 2
exports.always = exports.curry2(exports.id);

var slice = Array.prototype.slice;

var toArray = function(a) {
  return slice.call(a);
};

exports.liftp = function(fn) {
  return function() {
    return Promise.all(toArray(arguments)).then(exports.apply(fn));
  };
};

// <*
exports.firstp = exports.liftp(exports.always);

// *>
exports.secondp = exports.liftp(exports.always(exports.id));

exports.mapp = exports.curry2(function(fn, p) {
  return p.then(fn);
});
