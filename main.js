// X-MAZE III SOURCE CODE
// Made in KonaltEngine

// Get KE libs
const { Renderer, RenderOptions } = require("./libs/renderer");
const levelreader = require("./libs/levelreader");
const menuscreen = require("./libs/menuscreen");
const { KeyAction } = require("./libs/keyboard");
const { Entity } = require("./libs/entity");
const Direction = require("./libs/direction");

// Create renderer
var renderer = new Renderer();
renderer.setText("Loading...");
renderer.setOptions(new RenderOptions("", 0));
renderer.setEnabled(true);

// Create entity
var player = new Entity("Player");
player.setSprite("☻");
// Add entity to renderer
renderer.addEntity(player);

var level = levelreader.getLevelData(process.argv.includes("--level") ? process.argv[process.argv.indexOf("--level") + 1] : "testlevel");
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

// Movement Code
var upAction = new KeyAction(function(data) {
    player.move(Direction.UP);
}, "w");
var downAction = new KeyAction(function(data) {
    player.move(Direction.DOWN);
}, "s");
var leftAction = new KeyAction(function(data) {
    player.move(Direction.LEFT);
}, "a");
var rightAction = new KeyAction(function(data) {
    player.move(Direction.RIGHT);
}, "d");