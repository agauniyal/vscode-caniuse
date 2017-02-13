const vscode = require('vscode');
const api = require('caniuse-api');


function isEmptyObj(obj) {
  return Object.getOwnPropertyNames(obj).length === 0;
}


function nickname(name = '') {
  switch (name) {
    case 'firefox': return 'FF';
    case 'chrome' : return 'CR';
    case 'ie'     : return 'IE';
    case 'edge'   : return 'Edge';
    case 'safari' : return 'SF';
    case 'android': return 'And';
    case 'and_chr': return 'And-CR';
    case 'ios_saf': return 'iOS';
    case 'opera'  : return 'OP';
    case 'and_uc' : return 'UC';
    case 'op_mini': return 'OP-mini';
    case 'ie_mob' : return 'IE-mob';

    default       : return 'Rest';
  }
}


function provideMatches(feature) {
  let matches = [];
  try {
    matches = api.find(feature);
  } catch (e) {} finally {
    return matches;
  }
}


function pickSuggestions(matches) {
  return new Promise((resolve, reject) => {
    vscode.window.showQuickPick(matches)
      .then(pickedItem => {
        try {
          result = api.getSupport(pickedItem);
        } catch (e) {
          return reject(e.message);
        }
        const showAll = vscode.workspace.getConfiguration('caniuse').show_all;
        const stringToRet = statusBuilder(result, !showAll);
        resolve(stringToRet);
      });
  });
}


function statusBuilder(browserObj, onlyMajor = true) {

  if (isEmptyObj(browserObj)) {
    return '';
  }

  const browserArr = Object.keys(browserObj);
  if (browserArr.length === 0) {
    return '';
  }

  const majorBrowsers = ['firefox', 'chrome', 'edge', 'ie', 'safari'];
  let statusString = `$(search) `;

  browserArr.forEach(browser => {
    if (browserObj[browser].hasOwnProperty('y')) {
      if (onlyMajor && (majorBrowsers.indexOf(browser) !== -1)) {
        statusString += ' ' + nickname(browser) + ' ⇒ ' + browserObj[browser].y + ` $(check) `;
      } else if (!onlyMajor) {
        statusString += ' ' + nickname(browser) + ' ⇒ ' + browserObj[browser].y + ` $(check) `;
      }
    }
  });
  return statusString;
}


module.exports = {
  statusBuilder,
  provideMatches,
  pickSuggestions
};
