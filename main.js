// X-MAZE III SOURCE CODE
// Made in KonaltEngine

// Get KE libs
const { Renderer, RenderOptions } = require("./libs/renderer");
const levelreader = require("./libs/levelreader");
const { KeyAction } = require("./libs/keyboard");
const { Entity } = require("./libs/entity");
const Direction = require("./libs/direction");
const mainmenu = require("./libs/menuscreen");

// Create renderer
var renderer = new Renderer();
renderer.setText("Loading...");
renderer.setOptions(new RenderOptions("", 0));
renderer.setEnabled(true);
renderer.widthEnforcement = false;

// Create main menu
var mainMenuSelectedOption = 0;
renderer.setText(mainmenu.generateMainMenu(mainMenuSelectedOption));
renderer.setPostRender(function() {
    renderer.setText(mainmenu.generateMainMenu(mainMenuSelectedOption));
});
// Create entity
var player = new Entity("Player");
player.setSprite("☻");

var movementKeyActions = {};

var menuKeyActions = {
    scrollUp: new KeyAction(function(data) {
        mainMenuSelectedOption--;
        if (mainMenuSelectedOption < 0) {
            mainMenuSelectedOption = mainmenu.options.length < 1;
        }
    }, "w"),
    scrollDown: new KeyAction(function(data) {
        mainMenuSelectedOption++;
        if (mainMenuSelectedOption >= mainmenu.options.length) {
            mainMenuSelectedOption = 0;
        }
    }, "s"),
    chooseOption: new KeyAction(function(data) {
        if (mainMenuSelectedOption == 0) {
            setLevel("testlevel");
            Object.values(menuKeyActions).forEach(action => {
                action.delete();
            });
            menuKeyActions = {
                upAction: new KeyAction(function(data) {
                    player.move(Direction.UP);
                }, "w"),
                downAction: new KeyAction(function(data) {
                    player.move(Direction.DOWN);
                }, "s"),
                leftAction: new KeyAction(function(data) {
                    player.move(Direction.LEFT);
                }, "a"),
                rightAction: new KeyAction(function(data) {
                    player.move(Direction.RIGHT);
                }, "d")
            }
        }
    }, "return")
}

function setLevel(level) {
    var level = levelreader.getLevelData(process.argv.includes("--level") ? process.argv[process.argv.indexOf("--level") + 1] : "testlevel");
    // Add player to renderer, if not already in renderer
    if (!renderer.hasEntity(player)) renderer.addEntity(player);
    if (level != null) {
        renderer.setEnabled(false);
        console.log("Level exists. Name: " + level.name);
        renderer.setOptions(new RenderOptions("█", 0));
        renderer.setData(level.data);
        if (process.argv.includes("--slow")) renderer.setFrametime(500);
        if (process.argv.includes("--megafast")) renderer.setFrametime(1);
        renderer.setText(renderer.getTextFromData());
        renderer.setPrefixText(level.name);
        renderer.setSuffixText(`X: ${player.x}, Y: ${player.y}${player.isOutOfBounds ? "\nPlayer is out of bounds!" : ""}`);
        renderer.setPostRender(function() {
            renderer.setSuffixText(`X: ${player.x}, Y: ${player.y}${player.isOutOfBounds ? "\nPlayer is out of bounds!" : ""}`);
        });
        renderer.setEnabled(true);
    } else {
        renderer.setEnabled(false);
        console.log("Level does not exist!");
        process.exit(1);
    }
}