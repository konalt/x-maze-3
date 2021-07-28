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

function saveLevel(levelData, levelname = "unknown", overrideFolder = "levels") {
    console.log("Saving level " + path.join(overrideFolder, levelname));
    try {
        if (fs.existsSync(path.join("./", overrideFolder, levelname + ".json"))) {
            fs.writeFileSync(path.join("./", overrideFolder, levelname + Math.ceil(Math.random() * 100) + ".json"), JSON.stringify({
                name: levelname,
                data: {
                    ents: levelData.entities,
                    geo: levelData.geo
                }
            }));
            return;
        } else {
            fs.writeFileSync(path.join("./", overrideFolder, levelname + ".json"), JSON.stringify({
                name: levelname,
                data: {
                    ents: levelData.entities,
                    geo: levelData.geo
                }
            }));
            return;
        }
    } catch (err) {
        console.error(err)
        return null;
    }
}

function loadLevel(levelname, renderer) {
    var level = getLevelData(levelname);
    // Add player to renderer, if not already in renderer
    if (level != null) {
        renderer.setData(level.data.geo);
        renderer.setText(renderer.getTextFromData());
        renderer.setPrefixText(level.name);
        return true;
    } else {
        renderer.setEnabled(false);
        return false;
    }
}

module.exports.getLevelData = getLevelData;
module.exports.saveLevel = saveLevel;
module.exports.loadLevel = loadLevel;