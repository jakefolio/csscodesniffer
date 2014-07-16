var assert = require("assert");

var CSSCodeSniffer = require('../../src/csscodesniffer');
var parserlib = require('parserlib');
var parser = new parserlib.css.Parser();

var sniffer = new CSSCodeSniffer(parser);

describe('[consistent-quotes] Check for consistency in quotes', function() {
    var errorCount = 0;
    var reporter = { report: function() { errorCount++; } };

    before(function() {
        sniffer.clearRules();
        require('../../src/rules/consistent-quotes')(sniffer);
    });

    beforeEach(function() {
        errorCount = 0;
    });

    it('should not report any errors for multiple background urls', function() {
        var sampleCSS = "\n\
        .example {\n\
            background: url(\"/some/path\"), url(\"/some/other/path\");\n\
            height: 100px;\n\
        }";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal(0, errorCount);
    });

    it('should not report any errors for double quotes for attribute selectors', function() {
        var sampleCSS = "\n\
        .a[data-id=\"1\"] {\n\
            display: inline-block;\n\
            height: 100px;\n\
        }";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal(0, errorCount);
    });

    describe('When rule value is set to double', function() {
        it('should not report any errors if the starting and closing quotes are double quotes', function() {
            var sampleCSS = "\n\
            .example {\n\
                background: url(\"/some/path\");\n\
                height: 100px;\n\
            }";

            sniffer.run([{ filename: null, source: sampleCSS }], reporter);

            assert.equal(0, errorCount);
        });

        it('should report an error if opening and closing quotes are single quotes', function() {
            var sampleCSS = "\n\
            .example {\n\
                background: url('/some/path');\n\
                height: 100px;\n\
            }";

            sniffer.run([{ filename: null, source: sampleCSS }], reporter);

            assert.equal((errorCount >= 1), true);
        });
    });

    describe('When rule value is set to single', function() {
        it('should not report an error if opening and closing quotes are single quotes', function() {
            var sampleCSS = "\n\
            .example {\n\
                background: url('/some/path');\n\
                height: 100px;\n\
            }";

            sniffer.setRuleset({
                "rules": {
                    "consistent-quotes": "single"
                }
            });

            sniffer.run([{ filename: null, source: sampleCSS }], reporter);

            assert.equal(0, errorCount);
        });

        it('should report an error if the starting and closing quotes are double quotes', function() {
            var sampleCSS = "\n\
            .example {\n\
                background: url(\"/some/path\");\n\
                height: 100px;\n\
            }";

            sniffer.setRuleset({
                "rules": {
                    "consistent-quotes": "single"
                }
            });

            sniffer.run([{ filename: null, source: sampleCSS }], reporter);

            assert.equal((errorCount >= 1), true);
        });
    });

});