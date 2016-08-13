const testRunner = require('vscode/lib/testrunner');

testRunner.configure({
  ui: 'tdd', // the TDD UI is being used in extension.test.js (suite, test, etc.)
  useColors: true // colored output from test results
});

module.exports = testRunner;
