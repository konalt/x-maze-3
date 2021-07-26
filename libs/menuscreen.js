var options = ["Play", "Settings", "Exit Game"];

function generateMainMenu(selected) {
    var menuText = "X-MAZE III\n";
    options.forEach((option, optionID) => {
        if (optionID == selected) {
            menuText += "\x1b[47;30m" + option + " <- Selected\x1b[0m\n";
        } else {
            menuText += option + "\n";
        }
        menuText += "\n\x1b[0m";
    });
    return menuText;
}

module.exports.generateMainMenu = generateMainMenu;
module.exports.options = options;