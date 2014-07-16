var assert = require("assert");

var CSSCodeSniffer = require('../../src/csscodesniffer');
var parserlib = require('parserlib');
var parser = new parserlib.css.Parser();

var sniffer = new CSSCodeSniffer(parser);

describe('[brace-alignment] Check alignment of selectors and end brace', function() {
    var errorCount = 0;
    var reporter = { report: function() { errorCount++; } };

    before(function() {
        sniffer.clearRules();
        require('../../src/rules/brace-alignment')(sniffer);
    });

    beforeEach(function() {
        errorCount = 0;
    });

    it('should not report any errors if the starting and closing braces are on the same column', function(){
        var sampleCSS = "\n\
        .example {\n\
            width: 200px;\n\
            height: 100px;\n\
        }";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal(0, errorCount);
    });

    it('should report an error if the opening and closing braces are not on the same column', function() {
        var sampleCSS = "\n\
        .example {\n\
            width: 200px;\n\
            height: 100px; }";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal((errorCount >= 1), true);
    });

    it('should not report an error if the declaration is a single line declaration', function() {
        var sampleCSS = ".example { width: 200px; height: 100px; }";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal(0, errorCount);
    });

});