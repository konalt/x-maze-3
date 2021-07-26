class Command {
    constructor(cb = function() { return "This command is not supported yet."; }) {
        this.cb = cb;
    }
    run(args) {
        if (typeof args == "string") {
            args = args.split(" ");
        }
        this.cb(args);
    }
}

const commandList = {
    test: new Command(args => {
        return "This is a test command. Arguments:" + args.join(",");
    }),
    close: new Command(args => {
        return "CLOSE_CONSOLE";
    })
};

function runCommand(command, args) {
    if (commandList[command]) {
        return commandList[command].run(args);
    } else {
        return "Invalid command: " + command;
    }
}

module.exports.run = runCommand