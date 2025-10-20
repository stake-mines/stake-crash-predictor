(function (sha256, sha224) {
  // Add helper to convert Array or ArrayBuffer to hex string
  Array.prototype.toHexString = ArrayBuffer.prototype.toHexString = function () {
    const bytes = new Uint8Array(this);
    let hexStr = '';
    for (let i = 0; i < bytes.length; i++) {
      const hexByte = bytes[i].toString(16);
      hexStr += hexByte.length === 1 ? '0' + hexByte : hexByte;
    }
    return hexStr;
  };

  const testVectors = {
    sha256_hmac: {
      'Test Vectors': {
        'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7': [
          [0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b, 0x0b],
          'Hi There'
        ],
        '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843': [
          'Jefe',
          'what do ya want for nothing?'
        ],
        '773ea91e36800e46854db8ebd09181a72959098b3ef8c122d9635514ced565fe': [
          new Array(20).fill(0xaa),
          new Array(50).fill(0xdd)
        ],
        '82558a389a443c0ea4cc819899f2083a85f0faa3e578f8077a2e3ff46729665b': [
          new Array(25).fill(0x01),
          new Array(50).fill(0xcd)
        ]
      },
      'UTF8': {
        '865cc329d317f6d9fdbd183a3c5cc5fd4c370d11f98abbbb404bceb1e6392c7e': ['中文', '中文'],
        'efeef87be5731506b69bb64a9898a456dd12c94834c36a4d8ba99e3db79ad7ed': ['aécio', 'aécio'],
        '8a6e527049b9cfc7e1c84bcf356a1289c95da68a586c03de3327f3de0d3737fe': ['𠜎', '𠜎']
      }
    },
    sha224_hmac: {
      'Test Vectors': {
        '896fb1128abbdf196832107cd49df33f47b4b1169912ba4f53684b22': [
          new Array(20).fill(0x0b),
          'Hi There'
        ],
        'a30e01098bc6dbbf45690f3a7e9e6d0f8bbea2a39e6148008fd05e44': [
          'Jefe',
          'what do ya want for nothing?'
        ]
      },
      'UTF8': {
        'e2280928fe813aeb7fa59aa14dd5e589041bfdf91945d19d25b9f3db': ['中文', '中文'],
        '86c53dc054b16f6e006a254891bc9ff0da5df8e1a6faee3b0aaa732d': ['aécio', 'aécio'],
        'e9e5991bfb84506b105f800afac1599ff807bb8e20db8ffda48997b9': ['𠜎', '𠜎']
      }
    }
  };

  const invalidInputs = [null, undefined, { length: 0 }, 0, 1, false, true, NaN, Infinity, function() {}];

  function executeTests(name, algorithm) {
    const simpleMethods = [
      { name, fn: algorithm },
      { name: name + '.hex', fn: algorithm.hex },
      { name: name + '.array', fn: (k, m) => algorithm.array(k, m).toHexString() },
      { name: name + '.digest', fn: (k, m) => algorithm.digest(k, m).toHexString() },
      { name: name + '.arrayBuffer', fn: (k, m) => algorithm.arrayBuffer(k, m).toHexString() }
    ];

    const classBasedMethods = [
      { name: 'create', fn: (k, m) => algorithm.create(k).update(m).toString() },
      { name: 'update', fn: (k, m) => algorithm.update(k, m).toString() },
      { name: 'hex', fn: (k, m) => algorithm.update(k, m).hex() },
      { name: 'array', fn: (k, m) => algorithm.update(k, m).array().toHexString() },
      { name: 'digest', fn: (k, m) => algorithm.update(k, m).digest().toHexString() },
      { name: 'arrayBuffer', fn: (k, m) => algorithm.update(k, m).arrayBuffer().toHexString() },
      {
        name: 'finalize',
        fn: (k, m) => {
          const h = algorithm.update(k, m);
          h.hex();
          h.update(m);
          return h.hex();
        }
      }
    ];

    const tests = testVectors[name];

    describe(name, function () {
      simpleMethods.forEach(({ name: methodName, fn }) => {
        describe('#' + methodName, function () {
          for (const group in tests) {
            const cases = tests[group];
            for (const hash in cases) {
              ((msg, expected) => {
                it('matches expected hash', function () {
                  expect(fn(msg[0], msg[1])).to.be(expected);
                });
              })(cases[hash], hash);
            }
          }
        });
      });

      classBasedMethods.forEach(({ name: methodName, fn }) => {
        describe('#' + methodName, function () {
          for (const group in tests) {
            const cases = tests[group];
            for (const hash in cases) {
              ((msg, expected) => {
                it('matches expected hash', function () {
                  expect(fn(msg[0], msg[1])).to.be(expected);
                });
              })(cases[hash], hash);
            }
          }
        });
      });

      describe('#' + name, function () {
        invalidInputs.forEach(input => {
          context('invalid input: ' + input, function () {
            it('throws error', function () {
              expect(() => algorithm(input, '')).to.throwError(/input is invalid type/);
            });
          });
        });
      });
    });
  }

  executeTests('sha256_hmac', sha256.hmac);
  executeTests('sha224_hmac', sha224.hmac);
})(sha256, sha224);
