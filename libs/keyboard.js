const readline = require('readline');

var keyActions = {};

class KeyAction {
    constructor(callback = function() {}, keyName) {
        this.callback = callback;
        this.keyName = keyName;
        keyActions[keyName.toLowerCase()] = this;
    }
    delete() {
        keyActions[this.keyName.toLowerCase()] = undefined;
    }
}

process.stdin.setEncoding('utf-8');
process.stdin.on('keypress', (_, data) => {
    if (data && data.ctrl && data.name == 'c') process.exit();
    if (keyActions[data.name.toLowerCase()]) {
        keyActions[data.name.toLowerCase()].callback(data);
    }
    if (keyActions["*"]) {
        keyActions["*"].callback(data);
    }
});
process.setMaxListeners(0);
process.stdin.setRawMode(true);
readline.emitKeypressEvents(process.stdin);

module.exports.KeyAction = KeyAction;