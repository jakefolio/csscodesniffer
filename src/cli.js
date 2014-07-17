#!/usr/bin/env node
var command = require('commander');
var CSSCodeSniffer = require('./csscodesniffer');
var fs = require('fs');
var parserlib = require('parserlib');
var parser = new parserlib.css.Parser();

var cli = {

    /**
     * Currently supported code standards
     * @type {Array}
     */
    standards: ['default'],

    /**
     * Read in CLI options and parameters then run CSSCodeSniffer
     */
    run: function() {
        var ruleset;
        var results;
        var sniffer;
        var source;

        command
            .version('0.1.0')
            .usage('[options] <file>...')
            .option(
                '-e, --exclude-rules <exclude-rules>',
                'Comma separated list of rules to exclude, default runs all rules',
                this.createList
            )
            .option(
                '-i, --include-rules <include-rules>',
                'Comma separated list of rules to include, only these rules will be run',
                this.createList
            )
            .option(
                '-r, --ruleset <file>',
                'Custom ruleset file to use as code standard'
            )
            .option(
                '-s, --standard <standard>',
                'Pre-defined CSS Code Standard'
            );


        results = command.parse(process.argv);

        if (results.args.length === 0) {
            command.help();
            return;
        }

        // Get the ruleset
        if (results.ruleset) {
            ruleset = this.getRuleset(results.ruleset);
        } else {
            ruleset = this.getStandard(results.standard);
        }

        // Add filters to ruleset
        if (results.excludeRules) {
            if (!ruleset.filters) {
                ruleset.filters = {};
            }

            ruleset.filters.exclude = results.excludeRules;
        }

        if (results.includeRules) {
            if (!ruleset.filters) {
                ruleset.filters = {};
            }

            ruleset.filters.exclude = results.excludeRules;
        }

        sniffer = new CSSCodeSniffer(parser, ruleset);

        // Load all the rules
        this.loadRules(sniffer);

        source = this.getSource(results.args);
        sniffer.run(source);
    },

    createList: function(list) {
        return list.split(',');
    },

    /**
     * Get a pre-defined standard, if none found it will use default
     * @param  {String} standard CSS Code Standard
     * @return {Object}
     */
    getStandard: function(standard) {
        if (this.standards.indexOf(standard) === -1) {
            standard = 'default';
        }

        return this.getRuleset('./standards/' + standard + '.json');
    },

    /**
     * Get the JSON content for the ruleset
     * @param  {String} path File path to JSON ruleset
     * @return {Object}
     */
    getRuleset: function(path) {
        return JSON.parse(fs.readFileSync(path, { encoding: 'UTF-8' }));
    },

    /**
     * Read all the rules from rules directory and then load file
     * @param  {CSSCodeSniffer} sniffer Sniffer will be injected into Object
     */
    loadRules: function(sniffer) {
        var ruleFiles = fs.readdirSync('./rules');

        // Load Rule Files
        ruleFiles.forEach(function(file) {
            require('./rules/' + file)(sniffer);
        });
    },

    /**
     * Load CSS Source Files
     * @param {Array} source Source Directory or File Path
     * @param {Array} basePath
     * @return {Array} Collection
     */
    getSource: function(sourceFiles, basePath) {
        var _this = this;
        var results = [];
        var path = basePath || [];

        sourceFiles.forEach(function(sourceFile) {
            var record = {};
            var stat;

            path.push(sourceFile);
            stat = fs.statSync(path.join('/'));

            if (sourceFile[0] === '.') {
                path.pop();
                return;
            }

            if (stat.isDirectory()) {
                    var recursiveResults = _this.getSource(fs.readdirSync(path.join('/')), path);
                    results = results.concat(recursiveResults);
            }

            if (stat.isFile() && sourceFile.match(/\.css$/)) {
                record.filename = path.join('/');
                record.source = fs.readFileSync(path.join('/'), { encoding: 'UTF-8' });
                results.push(record);
            }

            path.pop();
        });

        return results;
    }
};

cli.run();