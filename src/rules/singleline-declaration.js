module.exports = function(sniffer) {
    /*
     * Rule: Check if single line declarations are allowed
     */
    return sniffer.addRule({

        //rule information
        id: "singleline-declaration",
        name: "Check for single line declarations",
        desc: "Determine if single line declarations are allowed",
        // Value Options: oneproperty|disallow
        defaultValue: 'oneproperty',
        value: null,
        messages: {
            'disallow': "Single line delcarations are not allowed",
            'oneproperty': "Single line delcarations are not allowed with more than 1 property"
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;
            var ruleStartLine = [];
            var propertyCount = [];

            function initValues(event) {
                ruleStartLine.push(event.line);
                propertyCount.push(0);
            }

            function checkPropertyCount() {
                var stream = this._tokenStream;

                if (!rule.evaluate(stream, ruleStartLine.pop(), propertyCount.pop())) {
                    reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule);
                }
            }

            parser.addListener("startrule", initValues);
            parser.addListener("startfontface", initValues);
            parser.addListener("startpage", initValues);
            parser.addListener("startpagemargin", initValues);
            parser.addListener("startmedia", initValues);
            parser.addListener("startkeyframes", initValues);

            parser.addListener("property", function() {
                propertyCount[propertyCount.length - 1] += 1;
            });

            parser.addListener("endrule", checkPropertyCount);
            parser.addListener("endfontface", checkPropertyCount);
            parser.addListener("endpage", checkPropertyCount);
            parser.addListener("endpagemargin", checkPropertyCount);
            parser.addListener("endmedia", checkPropertyCount);
            parser.addListener("endkeyframes", checkPropertyCount);

        },

        /**
         * Evaluate rule based on value
         * @param  {stream} stream Stream Token
         * @param  {integer} ruleStartLine Start line of initial selector, check for single line declaration
         * @param  {integer} propertyCount Count of properties in declaration
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(stream, ruleStartLine, propertyCount) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            // Check if single line declaration
            if (ruleValue === "disallow" && stream._token.startLine === ruleStartLine) {
                return false;
            }

            // Check for single line declaration with only one property
            if (
                ruleValue === "oneproperty" &&
                stream._token.startLine === ruleStartLine &&
                propertyCount > 1
                ) {
                return false;
            }

            return true;

        }

    });
};