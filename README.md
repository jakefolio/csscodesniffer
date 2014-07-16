# csscodesniffer
Verify that code standards are being properly followed with code sniffs. The code is currently in an early alpha state.

## Getting Started
Install the module with: `npm install csscodesniffer`

```javascript
var CSSCodeSniffer = require('csscodesniffer');
var sniffer = new CSSCodeSniffer(parser, ruleset);

CSSCodeSniffer.run(source, reporter);
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Special Thanks
There are a few projects that inspired my work on CSS Code Sniffer:
- CSS Lint
- PHP Code Sniffer

## Contributing
If you plan on contributing for CSS Code Sniffer, we just ask that you submit a Pull Request from your forked repo with passing tests to verify your additions/fixes.

Also, contributing is not strictly limited to code pull requests. We need plenty of bug submissions, documentation updating, and any other quality assurance tests.

## Release History
_(Nothing yet)_

## To Do
- Finish Rule Tests
- Create grunt contrib for codesniffer
- Look into creating wrappers around SASS/LESS parsers

## License
Copyright (c) 2014 Jake Smith
Licensed under the MIT license.