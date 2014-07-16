module.exports = function(sniffer) {
    /*
     * Rule: Check if indention is spaced correctly
     * @TODO: Add support for tabs
     */
    return sniffer.addRule({

        //rule information
        id: "indention",
        name: "Check if indention is spaced correctly",
        desc: "Determine if spacing matches criteria",
        // Value Options: 4space|2space
        defaultValue: '4space',
        value: null,
        messages: {
            '2space': "Indention must be 2 spaces",
            '4space': "Indention must be 4 spaces"
        },

        //initialization
        init: function(parser, reporter) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;
            var ruleStartColumn = [];
            var ruleStartLine = [];

            function startColumn(event) {
                ruleStartColumn.push(event.col);
                ruleStartLine.push(event.line);
            }

            function endColumn() {
                ruleStartColumn.pop();
                ruleStartLine.pop();
            }

            parser.addListener("startrule", startColumn);
            parser.addListener("startfontface", startColumn);
            parser.addListener("startpage", startColumn);
            parser.addListener("startpagemargin", startColumn);
            parser.addListener("startmedia", startColumn);
            parser.addListener("startkeyframes", startColumn);

            parser.addListener("property", function(event) {
                var stream = this._tokenStream;
                var ruleColumn = ruleStartColumn[ruleStartColumn.length - 1];
                var isSingleLineDeclaration = (ruleStartLine[ruleStartLine.length - 1] === stream._token.startLine);

                if (!isSingleLineDeclaration && !rule.evaluate(event.col, ruleColumn)) {
                    reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule);
                }

            });

            parser.addListener("endrule", endColumn);
            parser.addListener("endfontface", endColumn);
            parser.addListener("endpage", endColumn);
            parser.addListener("endpagemargin", endColumn);
            parser.addListener("endmedia", endColumn);
            parser.addListener("endkeyframes", endColumn);

        },

        /**
         * Evaluate rule based on value
         * @param  {integer} propertyColumn Starting column for property
         * @param  {integer} ruleColumn Starting column of rule declaration
         * @return {boolean} Determines if rule passes or fails
         */
        evaluate: function(propertyColumn, ruleColumn) {
            var rule = this;
            var ruleValue = rule.value || rule.defaultValue;

            if (ruleValue === "2space" && (propertyColumn - ruleColumn) !== 2) {
                return false;
            }

            if (ruleValue === "4space" && (propertyColumn - ruleColumn) !== 4) {
                return false;
            }

            return true;

        }

    });
};