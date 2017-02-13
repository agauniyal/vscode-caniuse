const vscode = require('vscode');
const method = require('./src/method');
const open = require('opn');


function activate(context) {

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  const DSelection = vscode.window.onDidChangeTextEditorSelection(() => {
    statusBarItem.hide();
  });
  const DEditor = vscode.window.onDidChangeActiveTextEditor(() => {
    statusBarItem.hide();
  });

  const DMain = vscode.commands.registerCommand('extension.caniuse', () => {

    const statusString = method.caniuse();
    Promise.resolve(statusString).then((string) => {
      statusBarItem.text = string !== '' ? string : `$(search) Unknown prop: search in browser`;
      statusBarItem.command = 'extension.browse';
      statusBarItem.tooltip = 'Click to search in caniuse website';
      statusBarItem.show();
    });
  });

  const DbrowserScope = vscode.commands.registerCommand('extension.setBrowserScope', method.setBrowserScope);
  const DCommand = vscode.commands.registerCommand('extension.browse', () => {
    open('http://caniuse.com/#search=' + method.getSelectedText());
  });

  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(DSelection);
  context.subscriptions.push(DEditor);
  context.subscriptions.push(DCommand);
  context.subscriptions.push(DbrowserScope);
  context.subscriptions.push(DMain);
}

exports.activate = activate;
exports.deactivate = function() {};
