'use strict';
var Promise = require('bluebird');

// purep :: a -> Promise a
exports.purep = function(a) {
  return Promise.resolve(a);
};

// apply :: (a -> b ... -> n -> x) -> [a, b ... n] -> x
var apply = function(fn) {
  return function(args) {
    return fn.apply(this, args);
  };
};

var curry2 = function(fn) {
  return function (a, b) {
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

// id :: a -> a
var id = function(a) {
  return a;
};

// always :: a -> b -> a
// > always(1, 2)
// 1
// > always(1)(2)
// 1
// > always(id)(1, 2)
// 2
// > always(id)(1)(2)
// 2
var always = curry2(id);

var slice = Array.prototype.slice;

var toArray = function(a) {
  return slice.call(a);
};

var fold = function(iter, initial, arr) {
  if (!arr.length) {
    return initial;
  }

  var newInitial = iter(initial, arr[0]);
  return fold(iter, newInitial, slice.call(arr, 1));
};

var map = function(f) {
  return function(arr) {
    return fold(function(memo, item) {
      return memo.concat([f(item)]);
    }, [], arr);
  };
};

var pipe = function() {
  var fns = toArray(arguments);
  return function(a) {
    return fold(function(acc, fn) {
      return fn(acc);
    }, a, fns);
  };
};

// mapp :: (a -> b) -> Promise a -> Promise b
exports.mapp = curry2(function(fn, p) {
  return p.then(fn);
});

// sequencep :: Array Promise a -> Promise Array a
exports.sequencep = function(arr) {
  return Promise.all(arr);
};

// traversep :: (a -> Promise b) -> Array a -> Promise Array b
exports.traversep = function(fn) {
  return pipe(map(fn), exports.sequencep);
};

exports.pipep = function() {
  var fns = toArray(arguments);
  return function(a) {
    return fold(function(accp, fn) {
      return accp.then(fn);
    }, exports.purep(a), fns);
  };
};

// liftp :: (a -> b -> ... n -> x)
//          -> Promise a -> Promise b -> ... -> Promise n
//          -> Promise x
exports.liftp = function(fn) {
  return function() {
    return exports.sequencep(toArray(arguments)).then(apply(fn));
  };
};

// alias <* firstp
// firstp :: Promise a -> Promise b -> Promise a
exports.firstp = exports.liftp(always);

// alias *> secondp
// secondp :: Promise a -> Promise b -> Promise b
exports.secondp = exports.liftp(always(id));
