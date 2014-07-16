var assert = require("assert");

var CSSCodeSniffer = require('../../src/csscodesniffer');
var parserlib = require('parserlib');
var parser = new parserlib.css.Parser();

var sniffer = new CSSCodeSniffer(parser);

describe('[last-semicolon] Check if semicolon is present on last property', function() {
    var errorCount = 0;
    var reporter = { report: function() { errorCount++; } };

    before(function() {
        sniffer.clearRules();
        require('../../src/rules/last-semicolon')(sniffer);
    });

    beforeEach(function() {
        errorCount = 0;
    });

    it('should error if no semicolon is on the last property of a declaration (default)', function() {
        var sampleCSS = ".square {\n\
            height: 100px;\n\
            width: 100px\n\
        }";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal((errorCount > 0), true);
    });

    it('should error if no semicolon is on the last property for a single line declaration (default)', function() {
        var sampleCSS = ".square { height: 100px; width: 100px }";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal((errorCount > 0), true);
    });

});