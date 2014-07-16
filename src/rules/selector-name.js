module.exports = function(sniffer) {
    /*
     * Rule: Check for consistent class naming
     */
    return sniffer.addRule({

        //rule information
        id: "selector-name",
        name: "Check for consistent class naming",
        desc: "Determine if class names follow the defined standard",
        // Value Options: camelcase|hyphen|underscore
        defaultValue: 'hyphen',
        value: null,
        messages: {
            'camelcase': "Class names must be camelcase (.myClassName)",
            'hyphen': "Class names must be hyphen separated (.my-class-name)",
            'underscore': "Class names must be underscore separated (.my_class_name)",
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
                                if (modifier.type === "class") {
                                    // Add class name for evaluation
                                    classes.push(modifier.text.substr(1));
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
                // Disqualify any non-camelcase rules if uppercase character found
                if (ruleValue !== "camelcase" && classList[i].match(/[A-Z]/)) {
                    return false;
                }

                // Disqualify any non-hyphen rules if hyphen character found
                if (ruleValue !== "hyphen" && classList[i].match(/-/)) {
                    return false;
                }

                // Disqualify any non-underscore rules if underscore character found
                if (ruleValue !== "underscore" && classList[i].match(/_/)) {
                    return false;
                }

                // If camelcase and found uppercase character, check if it follows camelCase format
                if (
                    ruleValue === "camelcase" &&
                    classList[i].match(/[A-Z]/) &&
                    !classList[i].match(/([a-z0-9]+[A-Z][a-z0-9]+){1,}/)
                    ) {
                    return false;
                }
            }

            return true;

        }

    });
};