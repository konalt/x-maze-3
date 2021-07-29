const { Entity } = require("./entity");
const { params } = require("./vars");

class RenderOptions {
    constructor(border = "█", padding = 1, defaultColor = "#c0c0c0") {
        this.border = border;
        this.padding = padding;
        this.col = defaultColor;
    }
}
class Renderer {
    constructor() {
        this.currentRendering = "KonaltEngine error R0: No render text set!";
        this.currentPrefixText = "";
        this.currentSuffixText = "";
        this.active = false;
        this.renderClock;
        this.currentOptions;
        this.postRenderCallback = function() {};
        this.preRenderCallback = function() {};
        this.entities = {};
        this.width = 0;
        this.height = 0;
        this.frametime = 16;
        this.widthEnforcement = true;
    };

    setText(text) {
        this.currentRendering = text;
        this.width = this.currentRendering.split("\n")[0].length;
        this.height = this.currentRendering.split("\n").length;
    }

    addEntity(entity) {
        this.entities[entity.name] = entity;
        entity.currentRenderer = this;
    }
    hasEntity(entity) {
        // force this to be a bool
        // this looks terrible but it works i guess
        return this.entities[entity.name] ? true : false;
    }
    setPrefixText(text) {
        this.currentPrefixText = text;
    }

    setSuffixText(text) {
        this.currentSuffixText = text;
    }

    setPostRender(cb) {
        this.postRenderCallback = cb;
    }
    setPreRender(cb) {
        this.preRenderCallback = cb;
    }
    setFrametime(ft) {
        this.frametime = ft;
        clearInterval(this.renderClock);
        this.renderClock = setInterval(() => {
            this.render();
        }, this.frametime);
    }

    setOptions(options = new RenderOptions()) {
        this.currentOptions = options;
    }

    // mr. renderer has to do this bc he's the one with all the fucking ent references
    // greedy little bitch
    doEntityCollision() {
        Object.values(this.entities).forEach((ent = new Entity()) => {
            // pls give object.length js
            if (ent.enableCollision && Object.keys(ent.collideFunctions).length > 0) {
                var samePosEnt = Object.values(this.entities).find(e => ent.x == e.x && ent.y == e.y);
                if (samePosEnt && ent.collideFunctions[samePosEnt.name] && samePosEnt.enableCollision) {
                    if (params.debug) console.log("DEBUG: Entity " + ent.name + " collided with entity " + samePosEnt.name + ".");
                    ent.collideFunctions[samePosEnt.name]();
                }
            }
        });
    }

    setEnabled(activate) {
        // set a variable
        this.active = activate;
        // make it do the rendery stuffs
        if (activate) {
            this.render();
        }
    }

    getBlockAt(x, y) {
        var yLine = this.currentRendering.split("\n")[y];
        if (!yLine || !yLine.split("")[x]) {
            return null;
        }
        var xBlock = yLine.split("")[x];
        return xBlock;
    }
    setBlockAt(x, y, char) {
        var yLine = this.currentRendering.split("\n")[y];
        if (!yLine || !yLine.split("")[x]) {
            return;
        }
        yLine = yLine.substr(0, x) + char + yLine.substr(x + char.length);
        this.currentRendering = this.currentRendering.substr(0, y) + yLine + this.currentRendering.substr(y + yLine.length);
    }
    getDataAt(x, y) {
        var toReturn = false;
        this.data.forEach((yLine, y2) => {
            yLine.forEach((xData, x2) => {
                if (x2 == x && y2 == y) {
                    toReturn = xData;
                }
            });
        });
        return toReturn;
    }
    setDataAt(x, y, dataToSet, updateText) {
        this.data[y][x] = dataToSet;
        this.setText(this.getTextFromData());
    }
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    getTextFromData() {
        var tempText = "";
        this.data.forEach((yLine, y) => {
            yLine.forEach((xData, x) => {
                switch (xData) {
                    case 0:
                        tempText += " ";
                        break;
                    case 1:
                        tempText += "█"
                        break;
                    default:
                        tempText += "?";
                        break;
                }
            });
            tempText += "\n";
        });
        tempText = tempText.substr(0, tempText.length - 1);
        return tempText;
    }

    render() {
        // if we're not rendering every 16ms (60fps) then start doin that
        if (!this.renderClock) {
            this.renderClock = setInterval(() => {
                this.render();
            }, this.frametime);
        } else {
            if (!this.active) {
                clearInterval(this.renderClock);
            } else {
                // Rendering code
                // Can someone please make a pull request to fix this
                // It's a fucking mess
                this.doEntityCollision();
                this.preRenderCallback();
                this._tmp_rendering = "";
                this._tmp_rendering += this.currentPrefixText ? this.currentPrefixText + "\n" : "";
                // if we want a border, then make a top border, 2 blocks bigger than frame width
                if (this.currentOptions.border != "") {
                    // Repeat border to contain text
                    this._tmp_rendering += this.currentOptions.border.repeat(this.width + 4 + (this.currentOptions.padding != 0 ? this.currentOptions.padding * 4 : 0)) + "\n";
                }
                for (let i = 0; i < this.currentOptions.padding; i++) {
                    this._tmp_rendering += (this.currentOptions.border ? this.currentOptions.border.repeat(2) : "") + " ".repeat(this.width + this.currentOptions.padding * 4) + (this.currentOptions.border ? this.currentOptions.border.repeat(2) : "") + "\n"
                }
                this.currentRendering.split("\n").forEach((y, index) => {
                    // I made this function while on about 200mg of caffeine
                    if (this.widthEnforcement) {
                        if (y.length > this.width) {
                            y = y.substr(0, this.width);
                        } else if (y.length < this.width) {
                            y.padEnd(y.length < this.width);
                        }
                    }
                    Object.values(this.entities).forEach(entity => {
                        if (entity.y == index) {
                            if (entity.x < 0 || entity.y < 0 || entity.x >= y.length || entity.y >= this.height) {
                                entity.isOutOfBounds = true;
                                return;
                            } else {
                                entity.isOutOfBounds = false;
                            }
                            if (this.getDataAt(entity.x, entity.y) == 1) {
                                y = y.substr(0, entity.x) + "\x1b[47;30m" + entity.sprite + "\x1b[0m" + y.substr(entity.x + entity.sprite.length);
                            } else {
                                y = y.substr(0, entity.x) + entity.sprite + y.substr(entity.x + entity.sprite.length);
                            }
                        }
                    });
                    this._tmp_rendering += (this.currentOptions.border ? this.currentOptions.border.repeat(2) : "") + " ".repeat(this.currentOptions.padding * 2) + y + " ".repeat(this.currentOptions.padding * 2) + (this.currentOptions.border ? this.currentOptions.border.repeat(2) : "") + "\n";
                });
                for (let i = 0; i < this.currentOptions.padding; i++) {
                    this._tmp_rendering += (this.currentOptions.border ? this.currentOptions.border.repeat(2) : "") + " ".repeat(this.width + this.currentOptions.padding * 4) + (this.currentOptions.border ? this.currentOptions.border.repeat(2) : "") + "\n"
                }
                if (this.currentOptions.border != "") {
                    // Repeat border to contain text (bottom)
                    this._tmp_rendering += this.currentOptions.border.repeat(this.width + 4 + (this.currentOptions.padding != 0 ? this.currentOptions.padding * 4 : 0));
                }
                this._tmp_rendering += this.currentSuffixText ? "\n" + this.currentSuffixText : "";
                this.postRenderCallback();
                // Draw render
                console.clear();
                console.log(this._tmp_rendering);
            }
        }
    }
}

// module exports shit
module.exports.Renderer = Renderer;
module.exports.RenderOptions = RenderOptions;