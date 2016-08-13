/* global suite, test */
const assert = require('assert');

const vscode = require('vscode');
const myExtension = require('../extension');

suite("Extension Tests", function() {

  test("Something 1", function() {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});
