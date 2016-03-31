'use strict';

var apply = function(fn) {
  return function(args) {
    return fn.apply(this, args);
  };
};

var slice = Array.prototype.slice;

module.exports = function(Promise) {
  return function(fn) {
    return function() {
      return Promise.all(slice(arguments)).then(apply(fn));
    };
  };
};
