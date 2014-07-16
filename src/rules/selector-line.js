module.exports = function(sniffer) {
    /*
     * Rule: Check selectors placement in a declaration
     * By default the rule requires selectors to be on their own line
     */
    return sniffer.addRule({

        //rule information
        id: "selector-line",
        name: "Selector line definition",
        desc: "Determine if a selector should be on the same line or new line.",
        // Value Options: newline|sameline
        defaultValue: 'newline',
        value: null,
        messages: {
            newline: "Each selector must be on it's own line",
            sameline: "Each selector must be on the same line ",
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleStartColumn;
            var ruleValue = rule.value || rule.defaultValue;

            parser.addListener("startrule", function(event) {
                ruleStartColumn = event.col;
            });

            parser.addListener("endrule", function(event) {
                var startLine = event.selectors[0].line;
                var currentSelector;

                if (event.selectors.length > 1) {
                    for (var i=0; i <= event.selectors.length-1; i++) {
                        currentSelector = event.selectors[i];

                        if (currentSelector !== event.selectors[0] && !rule.evaluate(startLine, currentSelector.line)) {
                            reporter.report(rule.messages[ruleValue], currentSelector.line, currentSelector.col, rule);
                        }
                    }
                }
            });

        },

        /**
         * Evaluate rule based on value
         * @param  {integer} startLine
         * @param  {integer} currentLine
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(startLine, currentLine) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            // Same Line Option
            if (ruleValue === "sameline" && startLine !== currentLine) {
                return false;
            }

            // New Line Option [default]
            if (ruleValue === "newline" && startLine === currentLine) {
                return false;
            }

            return true;

        }

    });
};