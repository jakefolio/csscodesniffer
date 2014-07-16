module.exports = function(sniffer) {
    /*
     * Rule: Check if there is a space before opening brace
     */
    return sniffer.addRule({

        //rule information
        id: "space-brace",
        name: "Check if there is a space before opening brace",
        desc: "Determine if there is a space before opening brace of declaration",
        // Value Options: required
        defaultValue: 'space',
        value: null,
        messages: {
            'space': "One space is required before opening brace of decalaration",
            'nospace': "No space is required before opening brace of declaration",
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            function findSpaceBeforeBrace() {
                var stream = this._tokenStream;
                var token;

                for (var i = 0; i <= 2; i++) {
                    // Find the token before Left Brace, opening declaration
                    if (stream.tokenType('LBRACE') === stream.LT(i).type) {
                        token = stream.LT(i - 1);
                        break;
                    }
                }

                if (!rule.evaluate(stream, token)) {
                    reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule);
                }
            }

            parser.addListener("startrule", findSpaceBeforeBrace);
            parser.addListener("startfontface", findSpaceBeforeBrace);
            parser.addListener("startpage", findSpaceBeforeBrace);
            parser.addListener("startpagemargin", findSpaceBeforeBrace);
            parser.addListener("startmedia", findSpaceBeforeBrace);
            parser.addListener("startkeyframes", findSpaceBeforeBrace);

        },

        /**
         * Evaluate rule based on value
         * @param  {object} stream Token Stream
         * @param  {object} token Token used to determine if it's using space
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(stream, token) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            if (ruleValue === "space" && token.type !== stream.tokenType('S')) {
                return false;
            }

            if (ruleValue === "nospace" && token.type !== stream.tokenType('IDENT')) {
                return false;
            }

            return true;

        }

    });
};