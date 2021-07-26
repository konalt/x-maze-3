const fs = require("fs");
const path = require("path");

function getLevelData(levelname = "unknown", overrideFolder = "levels") {
    if (levelname.split(".")[levelname.split(".").length - 1] !== "json") {
        levelname += ".json"
    }
    console.log("Searching for level " + path.join(overrideFolder, levelname));
    try {
        if (fs.existsSync(path.join("./", overrideFolder, levelname))) {
            // level exists, get data and return
            // this comment is misleading, it does not return level.data, it returns level
            // i can't reword stuff well
            return JSON.parse(fs.readFileSync(path.join("./", overrideFolder, levelname)).toString());
        } else {
            return null;
        }
    } catch (err) {
        console.error(err)
        return null;
    }
}

module.exports.getLevelData = getLevelData;