module.exports = function(sniffer) {
    /*
     * Rule: Check if semicolon is present on last property
     */
    return sniffer.addRule({

        //rule information
        id: "last-semicolon",
        name: "Check if semicolon is present on last property",
        desc: "Determine if last property has semicolon",
        // Value Options: required
        defaultValue: 'required',
        value: null,
        messages: {
            'required': "Last property semicolon is required",
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;
            var tokens = [];
            var lastPropertyTokens = [];

            function findLastToken() {
                // If no property token stored
                if (tokens.length === 0) {
                    return;
                }

                lastPropertyTokens.push(tokens.pop());
            }

            function findLastSemicolon() {
                var stream = this._tokenStream;

                if (lastPropertyTokens.length === 0 || !rule.evaluate(stream, lastPropertyTokens.pop())) {
                    reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule);
                }
            }

            parser.addListener("startrule", findLastToken);
            parser.addListener("startfontface", findLastToken);
            parser.addListener("startpage", findLastToken);
            parser.addListener("startpagemargin", findLastToken);
            parser.addListener("startmedia", findLastToken);
            parser.addListener("startkeyframes", findLastToken);

            parser.addListener("property", function() {
                var stream = this._tokenStream;

                // Store the next token after IDENT, which should be SEMICOLON
                tokens.push(stream.LT(1));
            });

            parser.addListener("endrule", findLastSemicolon);
            parser.addListener("endfontface", findLastSemicolon);
            parser.addListener("endpage", findLastSemicolon);
            parser.addListener("endpagemargin", findLastSemicolon);
            parser.addListener("endmedia", findLastSemicolon);
            parser.addListener("endkeyframes", findLastSemicolon);

        },

        /**
         * Evaluate rule based on value
         * @param  {object} stream Token Stream
         * @param  {object} token Token
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(stream, token) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            if (ruleValue === "required" && token.type !== stream.tokenType('SEMICOLON')) {
                return false;
            }

            return true;

        }

    });
};