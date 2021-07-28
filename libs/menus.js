var mainMenuOptions = ["Play", "Settings", "Level Editor", "Exit Game"];
var settingsMenuOptions = ["Some Setting", "Epic Setting", "Back"];

function generateMainMenu(selected) {
    var menuText = "X-MAZE III\n";
    mainMenuOptions.forEach((option, optionID) => {
        if (optionID == selected) {
            menuText += "\x1b[47;30m" + option + "\x1b[0m\n";
        } else {
            menuText += option + "\n";
        }
        menuText += "\n\x1b[0m";
    });
    return menuText;
}

function generateSettingsMenu(selected) {
    var menuText = "Settings\n";
    settingsMenuOptions.forEach((option, optionID) => {
        if (optionID == selected) {
            menuText += "\x1b[47;30m" + option + "\x1b[0m\n";
        } else {
            menuText += option + "\n";
        }
        menuText += "\n\x1b[0m";
    });
    return menuText;
}

function generateErrorPage() {
    var menuText = "An error has occurred. Please report it at https://github.com/konalt/x-maze-3/issues";
    return menuText;
}

function generateMenu(menuID, optionID) {
    switch (menuID) {
        case 0:
            return generateMainMenu(optionID);
        case 1:
            return generateSettingsMenu(optionID);
        default:
            return generateErrorPage();
    }
}

module.exports.generateMenu = generateMenu;
module.exports.mainMenuOptions = mainMenuOptions;
module.exports.settingsMenuOptions = settingsMenuOptions;