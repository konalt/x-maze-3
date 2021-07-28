// X-MAZE III SOURCE CODE
// Made in KonaltEngine

// Get KE libs
const { Renderer, RenderOptions } = require("./libs/renderer");
const levelparser = require("./libs/levelparser");
const { KeyAction } = require("./libs/keyboard");
const { Entity } = require("./libs/entity");
const { Direction } = require("./libs/direction");
const { run } = require("./libs/commands");
const menus = require("./libs/menus");
const { inspect } = require("util");

// Create renderer
var renderer = new Renderer();
renderer.setText("Loading...");
renderer.setOptions(new RenderOptions("", 0));
renderer.setEnabled(true);
renderer.widthEnforcement = false;

// Create main menu
var selectedOption = 0;
renderer.setText(menus.generateMenu(currentMenu, selectedOption));
renderer.setPostRender(function() {
    renderer.setText(menus.generateMenu(currentMenu, selectedOption));
});
var currentMenu = 0;

var player = new Entity("Player");

var currentCommand = "";
var cmdHistory = ["", "", "", "", ""];
var cmdActive = false;

var menuKeyActions = {
    scrollUp: new KeyAction(function(data) {
        selectedOption--;
        if (selectedOption < 0) {
            selectedOption = menus.mainMenuOptions.length < 1;
        }
    }, "w"),
    scrollDown: new KeyAction(function(data) {
        selectedOption++;
        if (selectedOption >= menus.mainMenuOptions.length) {
            selectedOption = 0;
        }
    }, "s"),
    chooseOption: new KeyAction(function(data) {
        switch (currentMenu) {
            case 0:
                // Main Menu
                switch (selectedOption) {
                    case 0:
                        // Play
                        player.setSprite("☻");
                        setLevel(process.argv.includes("--level") ? process.argv[process.argv.indexOf("--level") + 1] : "testlevel");
                        Object.values(menuKeyActions).forEach(action => {
                            action.delete();
                            action = undefined;
                        });
                        movementKeyActions = {
                            upAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                player.move(Direction.UP);
                            }, "w"),
                            downAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                player.move(Direction.DOWN);
                            }, "s"),
                            leftAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                player.move(Direction.LEFT);
                            }, "a"),
                            rightAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                player.move(Direction.RIGHT);
                            }, "d"),
                            enableCommandAction: new KeyAction(function(data) {
                                if (!data.shift || cmdActive) return;
                                cmdActive = true;
                            }, "c"),
                            commandTypeAction: new KeyAction(function(data) {
                                if (!cmdActive || (data.shift && data.name == "c")) return;
                                switch (data.name) {
                                    case "return":
                                        var result = run(currentCommand.split(" ")[0], currentCommand.split(" ").slice(1));
                                        // why this terribleness? i could fix it
                                        // but i don't want to so fuck it
                                        if (result == "CLOSE_CONSOLE") cmdActive = false;
                                        cmdHistory.push(">" + currentCommand);
                                        cmdHistory.push(result);
                                        cmdHistory.shift();
                                        cmdHistory.shift();
                                        console.log(cmdHistory.length);
                                        currentCommand = "";
                                        return;
                                    case "backspace":
                                        currentCommand = currentCommand.substr(0, currentCommand.length - 1);
                                        return;
                                    case "space":
                                        currentCommand += " ";
                                    case "up":
                                    case "down":
                                    case "left":
                                    case "right":
                                        return;
                                    default:
                                        currentCommand += data.name;
                                        return;
                                }
                            }, "*")
                        }
                        break;
                    case 1:
                        currentMenu = 1;
                        selectedOption = 0;
                        break;
                    case 3:
                        console.clear();
                        process.exit(0);
                    case 2:
                        // Open Level Editor
                        setLevelToEdit("blanklevel");
                        Object.values(menuKeyActions).forEach(action => {
                            action.delete();
                            action = undefined;
                        });
                        player.setSprite("+");
                        player.setCollision(false);
                        var movementKeyActions = {
                            upAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                player.move(Direction.UP);
                            }, "w"),
                            downAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                player.move(Direction.DOWN);
                            }, "s"),
                            leftAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                player.move(Direction.LEFT);
                            }, "a"),
                            rightAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                player.move(Direction.RIGHT);
                            }, "d"),
                            placeBlockAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                renderer.setDataAt(player.x, player.y, 1);
                            }, "1"),
                            deleteBlockAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                renderer.setDataAt(player.x, player.y, 0);
                            }, "0"),
                            saveLevelAction: new KeyAction(function(data) {
                                if (cmdActive) return;
                                levelparser.saveLevel({ geo: renderer.getData(), ents: Object.values(renderer.entities).filter(e => e.name != "Player") }, "UnnamedLevel_");
                            }, "r"),
                            enableCommandAction: new KeyAction(function(data) {
                                if (!data.shift || cmdActive) return;
                                cmdActive = true;
                            }, "c"),
                            commandTypeAction: new KeyAction(function(data) {
                                if (!cmdActive || (data.shift && data.name == "c")) return;
                                switch (data.name) {
                                    case "return":
                                        var result = run(currentCommand.split(" ")[0], currentCommand.split(" ").slice(1), renderer);
                                        // why this terribleness? i could fix it
                                        // but i don't want to so fuck it
                                        if (result == "CLOSE_CONSOLE") cmdActive = false;
                                        cmdHistory.push(">" + currentCommand);
                                        cmdHistory.push(result);
                                        cmdHistory.shift();
                                        cmdHistory.shift();
                                        console.log(cmdHistory.length);
                                        currentCommand = "";
                                        return;
                                    case "backspace":
                                        currentCommand = currentCommand.substr(0, currentCommand.length - 1);
                                        return;
                                    case "space":
                                        currentCommand += " ";
                                    case "up":
                                    case "down":
                                    case "left":
                                    case "right":
                                        return;
                                    default:
                                        currentCommand += data.name;
                                        return;
                                }
                            }, "*")
                        }
                        break;
                    default:
                        break;
                }
                break;
            case 1:
                switch (selectedOption) {
                    case 2:
                        currentMenu = 0;
                        selectedOption = 0;
                        break;

                    default:
                        break;
                }
                break;
            default:
                break;
        }

    }, "return")
}

function setLevel(levelname) {
    var level = levelparser.getLevelData(levelname);
    // Add player to renderer, if not already in renderer
    if (!renderer.hasEntity(player)) renderer.addEntity(player);
    if (level != null) {
        renderer.setEnabled(false);
        console.log("Level exists. Name: " + level.name);
        renderer.setOptions(new RenderOptions("█", 0));
        renderer.setData(level.data.geo);
        if (process.argv.includes("--slow")) renderer.setFrametime(500);
        if (process.argv.includes("--megafast")) renderer.setFrametime(1);
        renderer.setText(renderer.getTextFromData());
        renderer.setPrefixText(level.name);
        renderer.setSuffixText(`X: ${player.x}, Y: ${player.y}${player.isOutOfBounds ? "\nPlayer is out of bounds!" : ""}`);
        renderer.setPostRender(function() {
            renderer.setSuffixText(`X: ${player.x}, Y: ${player.y}${player.isOutOfBounds ? "\nPlayer is out of bounds!" : ""}${cmdActive ? "\nKonaltEngine Console\n---\n" + cmdHistory.join("\n") + "\n---\n>" + currentCommand + "\x1b[5m_\x1b[0m" : ""}`);
        });
        renderer.setEnabled(true);
    } else {
        renderer.setEnabled(false);
        console.log("Level does not exist!");
        process.exit(1);
    }
}

function setLevelToEdit(level) {
    var level = levelparser.getLevelData(process.argv.includes("--level") ? process.argv[process.argv.indexOf("--level") + 1] : "testlevel");
    // Add player to renderer, if not already in renderer
    if (!renderer.hasEntity(player)) renderer.addEntity(player);
    if (level != null) {
        renderer.setEnabled(false);
        console.log("Level exists. Name: " + level.name);
        renderer.setOptions(new RenderOptions("█", 0));
        renderer.setData(level.data.geo);
        if (process.argv.includes("--slow")) renderer.setFrametime(500);
        if (process.argv.includes("--megafast")) renderer.setFrametime(1);
        renderer.setText(renderer.getTextFromData());
        renderer.setPrefixText("LEVEL EDITOR - Editing " + level.name);
        renderer.setSuffixText(`X: ${player.x}, Y: ${player.y}${player.isOutOfBounds ? "\nPlayer is out of bounds!" : ""}`);
        renderer.setPostRender(function() {
            renderer.setSuffixText(`X: ${player.x}, Y: ${player.y}${player.isOutOfBounds ? "\nPlayer is out of bounds!" : ""}${cmdActive ? "\nKonaltEngine Console\n---\n" + cmdHistory.join("\n") + "\n---\n>" + currentCommand + "\x1b[5m_\x1b[0m" : ""}`);
        });
        renderer.setEnabled(true);
    } else {
        renderer.setEnabled(false);
        console.log("Level does not exist!");
        process.exit(1);
    }
}