class BlockType {
    constructor(hasCollision = true, sprite = "?") {
        this.col = hasCollision;
        this.sprite = sprite;
    }
}

const BlockTypes = {
    AIR: new BlockType(false, " "),
    BLOCK: new BlockType(true, "█"),
    KEYDOOR: new BlockType(false, "▒"),
    KEY: new BlockType(false, "○")
};

module.exports.BlockTypes = BlockTypes;