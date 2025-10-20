((sha256, sha224) => {
  // Extend arrays and ArrayBuffers with toHexString
  Array.prototype.toHexString = ArrayBuffer.prototype.toHexString = function () {
    const array = new Uint8Array(this);
    let hex = '';
    for (const byte of array) {
      const c = byte.toString(16);
      hex += c.length === 1 ? '0' + c : c;
    }
    return hex;
  };

  // Test cases
  const testCases = {
    sha256: {
      ascii: {
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855': '',
        'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592': 'The quick brown fox jumps over the lazy dog',
        'ef537f25c895bfa782526529a9b63d97aa631564d5d789c2b765448c8635fb6c': 'The quick brown fox jumps over the lazy dog.'
      },
      'ascii more than 64 bytes': {
        '54e73d89e1924fdcd056390266a983924b6d6d461e9470b6cd50bbaf69b5c54c':
          'The MD5 message-digest algorithm is a widely used cryptographic hash function producing a 128-bit (16-byte) hash value, typically expressed in text format as a 32 digit hexadecimal number. MD5 has been utilized in a wide variety of cryptographic applications, and is also commonly used to verify data integrity.'
      },
      UTF8: {
        '72726d8818f693066ceb69afa364218b692e62ea92b385782363780f47529c21': '中文',
        '53196d1acfce0c4b264e01e8018c989d571351f59e33f055f76ff15b4f0516c6': 'aécio',
        '8d10a48685dbc34484696de7ea7434d80a54c1d60100530faccf697463ef19c9': '𠜎',
        '2c731ad02e3d0e3c863bdbce4cce221e0be1d31efffdd8e1455a835e8287dc33':
          'Tehtäväsi on muotoilla teksti, jossa käyttäjälle suositellaan hänen henkilökohtaisiin tietoihinsa perustuen avioehdon tekemistä. Suosittelemme nimenomaan tätä tuotetta käyttäjän henkilökohtaisista tiedoista johtuen. Tuottamasi tekstin tulee olla lyhyt, persoonallinen, ymmärrettävä ja todenmukainen. Suositus perustuu seuraaviin seikkoihin:\n\nSeikka 0: Avioehdon tekeminen on verohyötyjen vuoksi suositeltavaa, koska olet ilmaissut että haluat kuoleman tapauksessa turvata ensisijaisesti aviopuolisosi asemaa (ennemmin kuin lasten asemaa). Avioehdolla voit määrätä, että puolet kuolleen puolison omaisuudesta siirtyy verovapaasti leskelle.\n\nVoit halutessasi hyödyntää seuraavia tietoja tekstin muotoilussa persoonallisemmaksi: Käyttäjällä on kumppani nimeltä PARTNER_NAME. Käyttäjällä on suurperhe. Käyttäjällä on lapsiperhe.\n\nPuhuttele käyttäjää siihen sävyyn että tiedät jo mitä käyttäjä haluaa, koska hän on kertonut toiveistaan, ja niiden perusteella tehty suositus on ilmiselvä. Joten älä käytä epävarmoja ilmaisuja kuten "halutessasi", vaan kirjoita itsevarmoilla ilmaisuilla kuten "koska haluat". Älä tee oletuksia käyttäjän sukupuolesta, emme tiedä onko hän mies vai nainen. Älä käytä sanaa jälkikasvu, puhu ennemmin lapsesta tai lapsista riippuen onko lapsia yksi vai useampia. Älä puhuttele käyttäjää ensimmäisessä persoonassa, käytä ennemmin passiivimuotoa. Tekstin sävyn tulisi olla neutraalin asiallinen, ei melodramaattinen eikä leikkisä. Pysy totuudessa, älä keksi uusia seikkoja yllä listattujen lisäksi. Viittaa ihmisiin nimillä silloin kun se on mahdollista. Tekstin tulisi olla vain muutaman lauseen mittainen. Älä siis kirjoita pitkiä selityksiä äläkä kirjoita listoja. Tiivistä oleellinen tieto lyhyeksi ja persoonalliseksi tekstiksi.'
      },
      'UTF8 more than 64 bytes': {
        'd691014feebf35b3500ef6f6738d0094cac63628a7a018a980a40292a77703d1':
          '訊息摘要演算法第五版（英語：Message-Digest Algorithm 5，縮寫為MD5），是當前電腦領域用於確保資訊傳輸完整一致而廣泛使用的雜湊演算法之一',
        '81a1472ebdeb09406a783d607ff49ee2fde3e9f44ac1cd158ad8d6ad3c4e69fa':
          '訊息摘要演算法第五版（英語：Message-Digest Algorithm 5，縮寫為MD5），是當前電腦領域用於確保資訊傳輸完整一致而廣泛使用的雜湊演算法之一（又譯雜湊演算法、摘要演算法等），主流程式語言普遍已有MD5的實作。'
      },
      'special length': {
        '5e6b963e2b6444dab8544beab8532850cef2a9d143872a6a5384abe37e61b3db': '0123456780123456780123456780123456780123456780123456780',
        '85d240a4a03a0710423fc4f701da51e8785c9eaa96d718ab1c7991d6afd60d62': '01234567801234567801234567801'
      },
      Array: {
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855': [],
        '182889f925ae4e5cc37118ded6ed87f7bdc7cab5ec5e78faef2e50048999473f': [211, 212]
      }
    },
    sha224: {
      ascii: {
        'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f': '',
        '730e109bd7a8a32b1cb9d9a09aa2325d2430587ddbc0c38bad911525': 'The quick brown fox jumps over the lazy dog'
      },
      UTF8: {
        'dfbab71afdf54388af4d55f8bd3de8c9b15e0eb916bf9125f4a959d4': '中文'
      },
      'special length': {
        'bc4a354d66f3cff4bc6dd6a88fbb0435cede7fd5fe94da0760cb1924': '0123456780123456780123456780123456780123456780123456780'
      }
    }
  };

  const errorTestCases = [null, undefined, { length: 0 }, 0, 1, false, true, NaN, Infinity, () => {}];

  // Run all test cases
  const runTestCases = (name, algorithm) => {
    const methods = [
      { name, call: algorithm },
      { name: name + '.hex', call: algorithm.hex },
      { name: name + '.array', call: msg => algorithm.array(msg).toHexString() },
      { name: name + '.digest', call: msg => algorithm.digest(msg).toHexString() },
      { name: name + '.arrayBuffer', call: msg => algorithm.arrayBuffer(msg).toHexString() }
    ];

    const classMethods = [
      { name: 'create', call: msg => algorithm.create().update(msg).toString() },
      { name: 'update', call: msg => algorithm.update(msg).toString() },
      { name: 'hex', call: msg => algorithm.update(msg).hex() },
      { name: 'array', call: msg => algorithm.update(msg).array().toHexString() },
      { name: 'digest', call: msg => algorithm.update(msg).digest().toHexString() },
      { name: 'arrayBuffer', call: msg => algorithm.update(msg).arrayBuffer().toHexString() },
      { name: 'finalize', call: msg => {
        const hash = algorithm.update(msg);
        hash.hex();
        hash.update(msg);
        return hash.hex();
      }}
    ];

    const subTestCases = testCases[name];

    describe(name, () => {
      for (const method of methods) {
        describe('#' + method.name, () => {
          for (const testCaseName in subTestCases) {
            const testCase = subTestCases[testCaseName];
            context('when ' + testCaseName, () => {
              for (const hash in testCase) {
                const message = testCase[hash];
                it('should be equal', () => {
                  expect(method.call(message)).to.be(hash);
                });
              }
            });
          }
        });
      }

      for (const method of classMethods) {
        describe('#' + method.name, () => {
          for (const testCaseName in subTestCases) {
            const testCase = subTestCases[testCaseName];
            context('when ' + testCaseName, () => {
              for (const hash in testCase) {
                const message = testCase[hash];
                it('should be equal', () => {
                  expect(method.call(message)).to.be(hash);
                });
              }
            });
          }
        });
      }

      describe('#' + name, () => {
        for (const testCase of errorTestCases) {
          context('when ' + testCase, () => {
            it('should throw error', () => {
              expect(() => algorithm(testCase)).to.throwError(/input is invalid type/);
            });
          });
        }

        context('when large size', () => {
          const hash = algorithm.create();
          hash.bytes = 4294967295;
          hash.update('any');
          expect(hash.hBytes).to.be(1);
        });
      });
    });
  };

  // Run SHA-2 tests
  runTestCases('sha256', sha256);
  runTestCases('sha224', sha224);

})(sha256, sha224);
