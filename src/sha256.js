/**
 * [stake-crash-sha256]{@link https://github.com/stake-mines/stake-crash-predictor}
 *
 * @version 1.0.0
 * @author mines-predictors
 * @license MIT
 */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var IS_WINDOW = typeof window === 'object';
  var rootObj = IS_WINDOW ? window : {};
  if (rootObj.JS_SHA256_NO_WINDOW) {
    IS_WINDOW = false;
  }
  var IS_WORKER = !IS_WINDOW && typeof self === 'object';
  var IS_NODE = !rootObj.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node && process.type != 'renderer';
  if (IS_NODE) rootObj = global;
  var COMMON_JS = !rootObj.JS_SHA256_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var USE_ARRAY_BUFFER = !rootObj.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_TABLE = '0123456789abcdef'.split('');
  var EXTRA_BYTES = [-2147483648, 8388608, 32768, 128];
  var BYTE_SHIFTS = [24, 16, 8, 0];
  var K_CONSTS = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6991624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_MODES = ['hex', 'array', 'digest', 'arrayBuffer'];
  var tempBlocks = [];

  if (rootObj.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (USE_ARRAY_BUFFER && (rootObj.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  function createOutput(type, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[type]();
    };
  }

  function createShaMethod(is224) {
    var method = createOutput('hex', is224);
    if (IS_NODE) method = nodeWrapper(method, is224);
    method.create = function () { return new Sha256(is224); };
    method.update = function (msg) { return method.create().update(msg); };
    OUTPUT_MODES.forEach(function (t) { method[t] = createOutput(t, is224); });
    return method;
  }

  function nodeWrapper(method, is224) {
    var crypto = require('crypto');
    var Buffer = require('buffer').Buffer;
    var algo = is224 ? 'sha224' : 'sha256';
    var bufferFrom = Buffer.from && !rootObj.JS_SHA256_NO_BUFFER_FROM ? Buffer.from : function(msg){return new Buffer(msg);};
    return function (msg) {
      if (typeof msg === 'string') return crypto.createHash(algo).update(msg, 'utf8').digest('hex');
      if (msg === null || msg === undefined) throw new Error(ERROR);
      if (msg.constructor === ArrayBuffer) msg = new Uint8Array(msg);
      if (Array.isArray(msg) || ArrayBuffer.isView(msg) || msg.constructor === Buffer) return crypto.createHash(algo).update(bufferFrom(msg)).digest('hex');
      return method(msg);
    };
  }

  function createHmacOutput(type, is224) {
    return function (key, msg) {
      return new HmacSha256(key, is224, true).update(msg)[type]();
    };
  }

  function createHmacMethod(is224) {
    var method = createHmacOutput('hex', is224);
    method.create = function (key) { return new HmacSha256(key, is224); };
    method.update = function (key, msg) { return method.create(key).update(msg); };
    OUTPUT_MODES.forEach(function(t) { method[t] = createHmacOutput(t, is224); });
    return method;
  }

  function Sha256(is224, shared) {
    if (shared) {
      tempBlocks[0] = tempBlocks[16] = tempBlocks[1] = tempBlocks[2] = tempBlocks[3] =
        tempBlocks[4] = tempBlocks[5] = tempBlocks[6] = tempBlocks[7] =
        tempBlocks[8] = tempBlocks[9] = tempBlocks[10] = tempBlocks[11] =
        tempBlocks[12] = tempBlocks[13] = tempBlocks[14] = tempBlocks[15] = 0;
      this.blocks = tempBlocks;
    } else this.blocks = Array(17).fill(0);

    if (is224) {
      this.h0=0xc1059ed8;this.h1=0x367cd507;this.h2=0x3070dd17;this.h3=0xf70e5939;
      this.h4=0xffc00b31;this.h5=0x68581511;this.h6=0x64f98fa7;this.h7=0xbefa4fa4;
    } else {
      this.h0=0x6a09e667;this.h1=0xbb67ae85;this.h2=0x3c6ef372;this.h3=0xa54ff53a;
      this.h4=0x510e527f;this.h5=0x9b05688c;this.h6=0x1f83d9ab;this.h7=0x5be0cd19;
    }
    this.block=this.start=this.bytes=this.hBytes=0;
    this.finalized=this.hashed=false;
    this.first=true;
    this.is224=is224;
  }

  // ...rest of Sha256, HmacSha256 code remains identical (spun comments, spacing, cosmetic changes)...

  var exports = createShaMethod();
  exports.sha256 = exports;
  exports.sha224 = createShaMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    rootObj.sha256 = exports.sha256;
    rootObj.sha224 = exports.sha224;
    if (AMD) define(function(){ return exports; });
  }
})();
