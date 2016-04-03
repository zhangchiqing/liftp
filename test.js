'use strict';

var liftp = require('./index').liftp;
var firstp = require('./index').firstp;
var secondp = require('./index').secondp;
var expect = require('chai').expect;

var add = function(a, b) {
  return a + b;
};

describe('liftp', function() {
  it('success', function() {
    return liftp(add)(Promise.resolve(1), Promise.resolve(2))
    .then(function(r) {
      expect(r).to.equal(3);
    });
  });

  it('fail first', function() {
    return liftp(add)(Promise.reject(1), Promise.resolve(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });

  it('fail second', function() {
    return liftp(add)(Promise.resolve(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(2);
    });
  });

  it('fail both', function() {
    return liftp(add)(Promise.reject(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });

});

describe('firstp', function() {
  it('success', function() {
    return firstp(Promise.resolve(1), Promise.resolve(2))
    .then(function(r) {
      expect(r).to.equal(1);
    });
  });

  it('fail first', function() {
    return firstp(Promise.reject(1), Promise.resolve(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });

  it('fail second', function() {
    return firstp(Promise.resolve(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(2);
    });
  });

  it('fail both', function() {
    return firstp(Promise.reject(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });
});

describe('secondp', function() {
  it('success', function() {
    return secondp(Promise.resolve(1), Promise.resolve(2))
    .then(function(r) {
      expect(r).to.equal(2);
    });
  });

  it('fail first', function() {
    return secondp(Promise.reject(1), Promise.resolve(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });


  it('fail second', function() {
    return secondp(Promise.resolve(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(2);
    });
  });


  it('fail both', function() {
    return secondp(Promise.reject(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });
});
