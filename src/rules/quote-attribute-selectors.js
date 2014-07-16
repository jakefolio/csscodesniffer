module.exports = function(sniffer) {
    /*
     * Rule: Check for consistent class naming
     */
    return sniffer.addRule({

        //rule information
        id: "quote-attribute-selectors",
        name: "Check quotes in attribute selector",
        desc: "Determine if quotes are being used to wrap attribute selectors",
        // Value Options: single|double
        defaultValue: 'double',
        value: null,
        messages: {
            'single': "Single quotes are required when using attribute selectors",
            'double': "Double quotes are required when using attribute selectors",
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            parser.addListener("startrule", function(event) {
                var selectors = event.selectors;
                var stream = this._tokenStream;
                var classes = [];
                var part;
                var modifier;
                var selector;
                // iterator variables
                var i, j, k;

                // Loop through selectors of declaration
                for (i=0; i < selectors.length; i++) {
                    selector = selectors[i];

                    // Loop through each part of single selector
                    for (j=0; j < selector.parts.length; j++) {
                        part = selector.parts[j];

                        // Check if selector has part
                        if (part.type === parser.SELECTOR_PART_TYPE) {

                            // loop through the parts
                            for (k=0; k < part.modifiers.length; k++) {
                                modifier = part.modifiers[k];
                                // check if modifier is a class
                                if (modifier.type === "attribute") {
                                    // Add class name for evaluation
                                    classes.push(modifier.text);
                                }
                            }
                        }
                    }

                }

                if (!rule.evaluate(classes)) {
                    reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule);
                }

            });

        },

        /**
         * Evaluate rule based on value
         * @param  {array} classList Class names to evaluate
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(classList) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;
            var i;
            var listLength;

            for (i = 0, listLength = classList.length - 1; i <= listLength; i++) {
                if (ruleValue === "single" && !classList[i].match(/=\s*[']([^']*)[']/)) {
                    return false;
                }

                if (ruleValue === "double" && !classList[i].match(/=\s*["]([^"]*)["]/)) {
                    return false;
                }
            }

            return true;

        }

    });
};