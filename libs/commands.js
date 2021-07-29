const { Direction } = require("./direction");
const { Entity } = require("./entity");
const levelparser = require("./levelparser");
const { Renderer } = require("./renderer");

// STOLE THIS FROM https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
// LOLOLOLOLOL
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

class Command {
    constructor(cb = function() { return "This command is not supported yet."; }) {
        this.cb = cb;
    }
    run(args, renderer) {
        if (typeof args == "string") {
            args = args.split(" ");
        }
        return this.cb(args, renderer);
    }
}

const commandList = {
    test: new Command(args => {
        return "This is a test command. Arguments:" + args.join(",");
    }),
    close: new Command(args => {
        return "CLOSE_CONSOLE";
    }),
    help: new Command(args => {
        return "KE Console help\nrenderer - Renderer subcommands\nent - Entity subcommands";
    }),
    ent: new Command((args, renderer) => {
        if (args.length == 0) {
            return "Usage: ent [subcommand]"
        }
        switch (args[0]) {
            case "clone":
                if (!args[1]) {
                    return "Usage: ent clone [entityname]";
                }
                var ent = renderer.entities[args[1].toLowerCase()];
                if (ent) {
                    var cache = [];
                    // I forgor 💀 that there's literally a renderer.addEntity() function
                    // I forgor 💀 that I should use that
                    // I'm too lazy to fix this soooo
                    renderer.entities[args[1].toLowerCase() + "_clone"] = JSON.parse(JSON.stringify({ ent: ent }, (key, value) => {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.includes(value)) return;
                            cache.push(value);
                        }
                        return value;
                    })).ent;
                    cache = null;
                    renderer.entities[args[1].toLowerCase() + "_clone"].name = args[1].toLowerCase() + "_clone";
                    return "Cloned entity.";
                } else {
                    return "Entity " + args[1].toLowerCase() + "does not exist";
                }
            case "sprite":
                if (!args[2]) {
                    return "Usage: ent sprite [entityname] [sprite]";
                }
                var ent = renderer.entities[args[1].toLowerCase()];
                if (ent) {
                    ent.setSprite(args[2].substr(0, 1));
                    return "Sprite set.";
                } else {
                    return "Entity " + args[1].toLowerCase() + "does not exist";
                }
            case "add":
                if (!args[1]) {
                    return "Usage: ent add [name]"
                }
                var newEnt = new Entity(args[1]);
                renderer.addEntity(newEnt);
                return "Entity " + args[1] + " added.";
            case "addpreset":
                if (!args[1]) {
                    return "Usage: ent addpreset [preset entity]"
                }
                var randSize = 6;
                switch (args[1]) {
                    case "key":
                        // In THEORY, this should stop duplicate entities
                        // unless you're astronomically unlucky
                        // haven't done the math yet
                        var en = "key.preset." + genRanHex(16);
                        var newEnt = new Entity(en);
                        newEnt.setSprite("○");
                        renderer.addEntity(newEnt);
                        return "Key added. Name: " + en;
                    case "keydoor":
                        var en = "keydoor.preset." + genRanHex(16);
                        var newEnt = new Entity(en);
                        // VSCode, why do this character be big tho
                        // https://github.com/Microsoft/vscode/issues/22262
                        // This issue is four years old
                        newEnt.setSprite("░");
                        // Plop it down on the player
                        newEnt.setPosition(renderer.entities.player.x, renderer.entities.player.y);
                        renderer.addEntity(newEnt);
                        return "Keydoor added. Name: " + en;

                    default:
                        return "No entity preset \"" + args[1] + "\"";
                }
            case "tp":
            case "setpos":
                if (!args[3]) {
                    return "Usage: ent " + args[0] + " [entityname] [x] [y]";
                }
                var ent = renderer.entities[args[1].toLowerCase()];
                if (ent) {
                    ent.setPosition(args[2], args[3]);
                    // For some reason this bugs out when an ent is teleported to x>1?
                    // Band aid solution here
                    ent.setCollision(false);
                    ent.move(Direction.LEFT);
                    ent.move(Direction.RIGHT);
                    ent.setCollision(true);
                    // Found because moving left and right fixes the issue
                    // Someone please fix this
                    return "Teleported entity " + args[1] + " to " + args[2] + "," + args[3];
                } else {
                    return "Entity " + args[1].toLowerCase() + "does not exist";
                }
            default:
                return "Unknown subcommand: " + args[0]
        }
    }),
    level: new Command((args, renderer) => {
        if (args.length == 0) {
            return "Usage: level [subcommand]";
        }
        if (args[0] == "save") {
            levelparser.saveLevel({ geo: renderer.getData(), ents: Object.values(renderer.entities).filter(e => e.name != "player") }, args[1]);
            return "Level saved: " + args[1];
        }
        if (args[0] == "clear") {
            var clearedLevel = [];
            renderer.setEnabled(false);
            renderer.getData().forEach(yLine => {
                var t = yLine;
                t.fill(0);
                clearedLevel.push(t);
            });
            renderer.setData(clearedLevel);
            renderer.setEnabled(true);
            renderer.setText(renderer.getTextFromData());
            return "Level cleared.";
        }
        if (args[0] == "load") {
            if (levelparser.loadLevel(args[1], renderer)) {
                renderer.entities["player"].setPosition(0, 0);
                return "Level Loaded.";
            }
            return "Level failed to load."
        }
    })
};

function runCommand(command, args, renderer) {
    if (commandList[command]) {
        return commandList[command].run(args, renderer);
    } else {
        return "Invalid command: " + command;
    }
}

module.exports.run = runCommand;