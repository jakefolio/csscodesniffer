var assert = require("assert");

var CSSCodeSniffer = require('../../src/csscodesniffer');
var parserlib = require('parserlib');
var parser = new parserlib.css.Parser();

var sniffer = new CSSCodeSniffer(parser);

describe('[indention] Check if indention is spaced correctly', function() {
    var errorCount = 0;
    var reporter = { report: function() { errorCount++; } };

    before(function() {
        sniffer.clearRules();
        require('../../src/rules/indention')(sniffer);
    });

    beforeEach(function() {
        errorCount = 0;
    });

    it('should ignore indention on single line declaration', function() {
        var sampleCSS = ".example { height: 100px; }";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal(0, errorCount);
    });

    describe('When rule value is set to 4space (default)', function() {
        it('should not report any errors for 4 spaces indention', function() {
            var sampleCSS = "\n\
            .a[data-id=\"1\"] {\n\
                display: inline-block;\n\
                height: 100px;\n\
            }\n\
            \n\
                .example {\n\
                    width: 3em;\n\
                }";

            sniffer.run([{ filename: null, source: sampleCSS }], reporter);

            assert.equal(0, errorCount);
        });

        it('should report an error for not using 4 spaces indention', function() {
            var sampleCSS = "\n\
            .a[data-id=\"1\"] {\n\
              display: inline-block;\n\
              height: 100px;\n\
            }\n\
            \n\
              .example {\n\
                width: 3em;\n\
              }";

            sniffer.run([{ filename: null, source: sampleCSS }], reporter);

            assert.equal((errorCount >= 1), true);
        });
    });

    describe('When rule value is set to 2space', function() {
        it('should not report any errors for 2 spaces indention', function() {
            var sampleCSS = "\n\
            .a[data-id=\"1\"] {\n\
              display: inline-block;\n\
              height: 100px;\n\
            }\n\
            \n\
              .example {\n\
                width: 3em;\n\
              }";

            sniffer.setRuleset({
                "rules": {
                    "indention": "2space"
                }
            });

            sniffer.run([{ filename: null, source: sampleCSS }], reporter);

            assert.equal(0, errorCount);
        });

        it('should report an error for not using 2 spaces indention', function() {
            var sampleCSS = "\n\
            .a[data-id=\"1\"] {\n\
                display: inline-block;\n\
                height: 100px;\n\
            }\n\
            \n\
                .example {\n\
                    width: 3em;\n\
                }";

            sniffer.setRuleset({
                "rules": {
                    "indention": "2space"
                }
            });

            sniffer.run([{ filename: null, source: sampleCSS }], reporter);

            assert.equal((errorCount >= 1), true);
        });
    });

});