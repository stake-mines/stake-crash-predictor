const expect = require('expect.js');
let WorkerClass = require("tiny-worker");

let sha256, sha224;
let BUFFER, window, self;
let JS_SHA256_NO_WINDOW, JS_SHA256_NO_NODE_JS, JS_SHA256_NO_COMMON_JS;
let JS_SHA256_NO_ARRAY_BUFFER, JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW;
let JS_SHA256_NO_BUFFER_FROM;
let WORKER, SOURCE;
let currentWorker;

// Clears cached modules and resets globals
const resetEnvironment = () => {
  [
    '../src/sha256.js',
    './test.js',
    './hmac-test.js'
  ].forEach(path => delete require.cache[require.resolve(path)]);

  sha256 = null;
  sha224 = null;
  BUFFER = undefined;
  JS_SHA256_NO_WINDOW = undefined;
  JS_SHA256_NO_NODE_JS = undefined;
  JS_SHA256_NO_COMMON_JS = undefined;
  JS_SHA256_NO_ARRAY_BUFFER = undefined;
  JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW = undefined;
  window = undefined;
};

// Load sha modules into global scope
const loadShaToGlobal = () => {
  const shaModule = require('../src/sha256.js');
  sha256 = shaModule.sha256;
  sha224 = shaModule.sha224;
};

// Run tests in commonjs (Node.js) environment
const runCommonJsTests = () => {
  loadShaToGlobal();
  require('./test.js');
  require('./hmac-test.js');
  resetEnvironment();
};

// Run tests simulating window/browser environment
const runBrowserTests = () => {
  window = global;
  require('../src/sha256.js');
  require('./test.js');
  require('./hmac-test.js');
  resetEnvironment();
};

// --- NODE.js TESTS ---
BUFFER = true;
runCommonJsTests();

// Node.js without Buffer.from
JS_SHA256_NO_BUFFER_FROM = true;
runCommonJsTests();

// Webpack / browser simulation
JS_SHA256_NO_NODE_JS = true;
window = global;
runCommonJsTests();

// Browser env
JS_SHA256_NO_NODE_JS = true;
JS_SHA256_NO_COMMON_JS = true;
runBrowserTests();

// Browser env without ArrayBuffer
JS_SHA256_NO_NODE_JS = true;
JS_SHA256_NO_COMMON_JS = true;
JS_SHA256_NO_ARRAY_BUFFER = true;
runBrowserTests();

// Browser env without ArrayBuffer.isView
JS_SHA256_NO_NODE_JS = true;
JS_SHA256_NO_COMMON_JS = true;
JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW = true;
runBrowserTests();

// Browser AMD simulation
JS_SHA256_NO_NODE_JS = true;
JS_SHA256_NO_COMMON_JS = true;
JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW = false;
window = global;

const define = (factory) => {
  sha256 = factory();
  sha224 = sha256.sha224;
  require('./test.js');
  require('./hmac-test.js');
};
define.amd = true;

require('../src/sha256.js');
resetEnvironment();

// --- WEB WORKER TESTS ---
WORKER = 'tests/worker.js';
SOURCE = 'src/sha256.js';
require('./worker-test.js');
delete require.cache[require.resolve('./worker-test.js')];

// Cover webworker in browser-like env
JS_SHA256_NO_WINDOW = true;
JS_SHA256_NO_NODE_JS = true;
WORKER = './worker.js';
SOURCE = '../src/sha256.js';
window = global;
self = global;

WorkerClass = function (file) {
  require(file);
  currentWorker = this;

  this.postMessage = (msg) => currentWorker.onmessage({ data: msg });
};

// mimic global postMessage for worker
postMessage = (msg) => currentWorker.onmessage({ data: msg });
importScripts = () => {};

loadShaToGlobal();
require('./worker-test.js');
