module.exports = function(sniffer) {
    /*
     * Rule: Check if newline follows declaration
     */
    return sniffer.addRule({

        //rule information
        id: "newline-after-declaration",
        name: "Check if new line follows declaration",
        desc: "Determine new line or no new line is present after declaration",
        // Value Options: required
        defaultValue: 'newline',
        value: null,
        messages: {
            'newline': "New line is required following declaration",
            'noline': "New line after declaration is not allowed",
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;
            var declarationEndLine = [];

            function compareLines(event) {
                var stream = this._tokenStream;

                // If no end line has been defined
                if (declarationEndLine.length === 0) {
                    return;
                }

                if (!rule.evaluate(event.line, declarationEndLine.pop())) {
                    reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule);
                }

            }

            function setEndLine() {
                var stream = this._tokenStream;

                for (var i = 0; i >= -3; i--) {
                    if (stream.LT(i).type === stream.tokenType('RBRACE')) {
                        declarationEndLine.push(stream.LT(i).endLine);
                        break;
                    }
                }

            }

            parser.addListener("startrule", compareLines);
            parser.addListener("startfontface", compareLines);
            parser.addListener("startpage", compareLines);
            parser.addListener("startpagemargin", compareLines);
            parser.addListener("startmedia", compareLines);
            parser.addListener("startkeyframes", compareLines);

            parser.addListener("endrule", setEndLine);
            parser.addListener("endfontface", setEndLine);
            parser.addListener("endpage", setEndLine);
            parser.addListener("endpagemargin", setEndLine);
            parser.addListener("endmedia", setEndLine);
            parser.addListener("endkeyframes", setEndLine);

        },

        /**
         * Evaluate rule based on value
         * @param  {integer} startLine New Declaration Start Line
         * @param  {integer} previousEndLine Previous Declaration End Line
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(startLine, previousEndLine) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            if (ruleValue === "newline" && (startLine - previousEndLine) <= 1) {
                return false;
            }

            if (ruleValue === "noline" && (startLine - previousEndLine) !== 1) {
                return false;
            }

            return true;

        }

    });
};