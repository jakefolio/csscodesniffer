module.exports = function(sniffer) {
    /*
     * Rule: Check alignment of selectors and end brace
     */
    return sniffer.addRule({
        //rule information
        id: "brace-alignment",
        name: "Check alignment of selectors and end brace",
        desc: "Determine if selector column and ending brace match",
        // Value Options: align
        defaultValue: 'align',
        value: null,
        messages: {
            'align': "Ending brace does not align with start of selectors",
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;
            var ruleStartColumn = [];
            var ruleStartLine = [];

            function initValues(event) {
                ruleStartColumn.push(event.col);
                ruleStartLine.push(event.line);
            }

            function checkLineAlignment() {
                var stream = this._tokenStream;

                if (!rule.evaluate(stream, ruleStartColumn.pop(), ruleStartLine.pop())) {
                    reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule);
                }
            }

            parser.addListener("startrule", initValues);
            parser.addListener("startfontface", initValues);
            parser.addListener("startpage", initValues);
            parser.addListener("startpagemargin", initValues);
            parser.addListener("startmedia", initValues);
            parser.addListener("startkeyframes", initValues);

            parser.addListener("endrule", checkLineAlignment);
            parser.addListener("endfontface", checkLineAlignment);
            parser.addListener("endpage", checkLineAlignment);
            parser.addListener("endpagemargin", checkLineAlignment);
            parser.addListener("endmedia", checkLineAlignment);
            parser.addListener("endkeyframes", checkLineAlignment);

        },

        /**
         * Evaluate rule based on value
         * @param  {stream} stream Stream Token
         * @param  {integer} ruleStartCol Start position of initial selector
         * @param  {integer} ruleStartLine Start line of initial selector, check for single line declaration
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(stream, ruleStartColumn, ruleStartLine) {
            var token;

            if (stream.tokenName(stream.LA(-1)) === 'RBRACE') {
                token = stream.LT(0);
            }

            if (stream.tokenName(stream.LA(-2)) === 'RBRACE') {
                token = stream.LT(-1);
            }

            if (stream.tokenName(stream.LA(-3)) === 'RBRACE') {
                token = stream.LT(-2);
            }

            // Columns do not need to match on single line declarations
            if (token.startLine === ruleStartLine) {
                return true;
            }

            // Check if columns match for RBRACE and first selector
            if (ruleStartColumn !== token.startCol) {
                return false;
            }

            return true;

        }

    });
};