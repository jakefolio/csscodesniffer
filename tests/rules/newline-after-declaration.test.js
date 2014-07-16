var assert = require("assert");

var CSSCodeSniffer = require('../../src/csscodesniffer');
var parserlib = require('parserlib');
var parser = new parserlib.css.Parser();

var sniffer = new CSSCodeSniffer(parser);

describe('[newline-after-declaration] Check if newline follows declaration', function() {
    var errorCount = 0;
    var reporter = { report: function() { errorCount++; } };

    before(function() {
        sniffer.clearRules();
        require('../../src/rules/newline-after-declaration')(sniffer);
    });

    beforeEach(function() {
        errorCount = 0;
    });

    it('should error if no newline exists following declaration', function() {
        var sampleCSS = ".square {\n\
            height: 100px;\n\
            width: 100px\n\
        }\n";

        sniffer.run([{ filename: null, source: sampleCSS }], reporter);

        assert.equal(0, errorCount);
    });

});