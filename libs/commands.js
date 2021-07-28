const { Entity } = require("./entity");
const levelparser = require("./levelparser");
const { Renderer } = require("./renderer");

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
                if (renderer.entities[args[1].toLowerCase()]) {
                    var cache = [];
                    renderer.entities[args[1].toLowerCase() + "_clone"] = JSON.parse(JSON.stringify({ ent: renderer.entities[args[1].toLowerCase()] }, (key, value) => {
                        if (typeof value === 'object' && value !== null) {
                            // Duplicate reference found, discard key
                            if (cache.includes(value)) return;

                            // Store value in our collection
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
                if (renderer.entities[args[1].toLowerCase()]) {
                    renderer.entities[args[1].toLowerCase()].setSprite(args[2].substr(0, 1));
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
            case "tp":
            case "setpos":
                if (!args[3]) {
                    return "Usage: ent " + args[0] + " [entityname] [x] [y]";
                }
                if (renderer.entities[args[1].toLowerCase()]) {
                    renderer.entities[args[1].toLowerCase()].setPosition(args[2], args[3]);
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