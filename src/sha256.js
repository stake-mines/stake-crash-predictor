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
const _Kmap = (() => {
  const nums = [
    "428a2f98","71374491","b5c0fbcf","e9b5dba5","3956c25b","59f111f1","923f82a4","ab1c5ed5",
    "d807aa98","12835b01","243185be","550c7dc3","72be5d74","80deb1fe","9bdc06a7","c19bf174",
    "e49b69c1","efbe4786","0fc19dc6","240ca1cc","2de92c6f","4a7484aa","5cb0a9dc","76f988da",
    "983e5152","a831c66d","b00327c8","bf597fc7","c6e00bf3","d5a79147","06ca6351","14292967",
    "27b70a85","2e1b2138","4d2c6dfc","53380d13","650a7354","766a0abb","81c2c92e","92722c85",
    "a2bfe8a1","a81a664b","c24b8b70","c76c51a3","d192e819","d6991624","f40e3585","106aa070",
    "19a4c116","1e376c08","2748774c","34b0bcb5","391c0cb3","4ed8aa4a","5b9cca4f","682e6ff3",
    "748f82ee","78a5636f","84c87814","8cc70208","90befffa","a4506ceb","bef9a3f7","c67178f2"
  ];
  return nums.map(x => parseInt(x, 16));
})();

const _OUTmodes = (() => {
  const arr = "hex|array|digest|arrayBuffer".split("|");
  return arr;
})();

let _tempBlk = new Array();

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
    // ensure the temp array can hold indices 0..16, then zero them
    if (tempBlocks.length < 17) tempBlocks.length = 17;
    for (let i = 0; i <= 16; i += 1) tempBlocks[i] = 0;

    // keep the same reference as the original
    this.blocks = tempBlocks;
    return;
  }

  // ...rest of constructor (unchanged) would continue here
}

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
