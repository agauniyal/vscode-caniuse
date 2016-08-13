const vscode = require('vscode');
const api = require('caniuse-api');
const utils = require('./utils');


function getSelectedText() {
  const editor = vscode.window.activeTextEditor;
  return editor ? editor.document.getText(editor.selection).trim() : '';
}


function setBrowserScope() {

  vscode.window.showInputBox().then(userInput => {
    if (userInput === undefined) {
      return;
    } else if (userInput === 'CONFIG') {
      browserScope = vscode.workspace.getConfiguration('caniuse').browser_scope;
      userInput = (browserScope !== null) ? browserScope : '> 5%, last 2 versions';
    }
    try {
      api.setBrowserScope(userInput);
    } catch (e) {
      vscode.window.showErrorMessage(e.message);
      return;
    }
    vscode.window.setStatusBarMessage(`BrowserScope updated $(check)`, 3000);
  });
}


function caniuse() {

  const feature = getSelectedText();
  if (feature === '') { return ''; }

  let result = {};
  try {
    result = api.getSupport(feature);
  } catch (e) {
    const suggestions = utils.provideMatches(feature);
    if (suggestions.length === 0) {
      vscode.window.showErrorMessage(e.message);
    } else {
      // return promise based string
      return utils.pickSuggestions(suggestions);
    }
  }
  const showAll = vscode.workspace.getConfiguration('caniuse').show_all;
  // returns actual string
  return utils.statusBuilder(result, !showAll);
}


module.exports = {
  getSelectedText,
  setBrowserScope,
  caniuse
};
