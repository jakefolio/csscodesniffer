/*
 * csscodesniffer
 * https://github.com/jakefolio/csscodesniffer
 *
 * Copyright (c) 2014 Jake Smith
 * Licensed under the MIT license.
 */

'use strict';

/**
 * CSSCodeSniffer Constructor
 * @param {Parser} parser CSS parser
 * @param {Object} ruleset
 */
function CSSCodeSniffer(parser, ruleset) {
    this.parser = parser;
    this.ruleset = ruleset || {};
}

/**
 * Code Sniffer Rules Collection
 * @type {Array}
 */
CSSCodeSniffer.prototype.rules = [];


/**
 * Set the ruleset
 * @param {Object} ruleset
 */
CSSCodeSniffer.prototype.setRuleset = function(ruleset) {
    this.ruleset = ruleset;
};

/**
 * Get the ruleset
 * @return {Object}
 */
CSSCodeSniffer.prototype.getRuleset = function() {
    return this.ruleset;
};

/**
 * Run the code sniffer rules
 * @param {Array} CSS source
 * @param {Object} reporter Reporter object for handling error messages
 */
CSSCodeSniffer.prototype.run = function(source, reporterObj) {
    var _this = this;
    var rules = this.getRules();
    var reporter = reporterObj || {
        report: function(msg, line, col) {
            console.log("[L" + line + ":C" + col + "] " + msg);
        }
    };

    if (rules.length <= 0) {
        // No Rules to sniff add some rules
        return;
    }

    rules.forEach(function(rule) {
        if (_this.getRuleset().rules && _this.rulesetHasRule(rule.id)) {
            rule.value = _this.getRuleset().rules[rule.id];
        }

        rule.init(_this.parser, reporter);
    });

    source.forEach(function(data) {
        // Parse CSS
        _this.parser.parse(data.source);
    });
};

/**
 * Add code sniffer rule
 * @param {Object} rule
 */
CSSCodeSniffer.prototype.addRule = function(rule) {
    this.rules.push(rule);
};

/**
 * Get rules collection
 * @return {Array} [description]
 */
CSSCodeSniffer.prototype.getRules = function() {
    return this.rules;
};

/**
 * Clear rules
 */
CSSCodeSniffer.prototype.clearRules = function() {
    this.rules = [];
};

/**
 * Check if ruleset contains a rule and check against filters
 */
CSSCodeSniffer.prototype.rulesetHasRule = function(ruleId) {
    var rule;

    if (!this.getRuleset()) {
        return false;
    }

    if (this.getRuleset().filters) {
        this.filterRuleset(this.getRuleset().filters);
    }

    for (rule in this.getRuleset().rules) {
        if (rule === ruleId) {
            return true;
        }
    }

    return false;
};

/**
 * Filter the rules in the ruleset based on inclusion/exclusion
 * @param {Object} filters
 * @param {Array} filters.include List of the only rules that should exist in ruleset
 * @param {Array} filters.exclude List of rules to exclude from the ruleset
 */
CSSCodeSniffer.prototype.filterRuleset = function(filters) {
    var rule;

    if (filters.include) {
        for (rule in this.getRuleset().rules) {
            if (filters.include.indexOf(rule) === -1) {
                delete this.getRuleset().rules[rule];
            }
        }
    }

    if (filters.exclude) {
        for (rule in this.getRuleset().rules) {
            if (filters.exclude.indexOf(rule) > -1) {
                delete this.getRuleset().rules[rule];
            }
        }
    }
};

module.exports = CSSCodeSniffer;