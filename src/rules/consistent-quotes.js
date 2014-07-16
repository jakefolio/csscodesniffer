module.exports = function(sniffer) {
    /*
     * Rule: Check for consistency in quotes
     */
    return sniffer.addRule({

        //rule information
        id: "consistent-quotes",
        name: "Check for consistency in quotes",
        desc: "Determine if quotes are being consistent between single and double quotes",
        // Value Options: single|double
        defaultValue: 'double',
        value: null,
        messages: {
            'single': "Use single quotes for property values, do not use double quotes",
            'double': "Use double quotes for property values, do not use single quotes",
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            parser.addListener("property", function(event) {
                var stream = this._tokenStream;

                if (!rule.evaluate(event.value.text)) {
                    reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule);
                }

            });

        },

        /**
         * Evaluate rule based on value
         * @param  {array} classList Class names to evaluate
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(propertyValue) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;


            if (ruleValue === "single" && propertyValue.match(/["]([^"]*)["]/)) {
                return false;
            }

            if (ruleValue === "double" && propertyValue.match(/[']([^']*)[']/)) {
                return false;
            }


            return true;

        }

    });
};