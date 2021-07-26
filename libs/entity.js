const { BlockType } = require("./blocktype");
const Direction = require("./direction");

class Entity {
    constructor(name = "Unknown Entity " + Math.ceil(Math.random() * 100)) {
        this.name = name;
        this.x = 0;
        this.y = 0;
        this.sprite = "?";
        this.visible = true;
        this.isOutOfBounds = false;
        this.enableCollision = true;
        this.currentRenderer;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    move(moveDirection) {
        // Clone x and y for collision purposes
        var xb = JSON.parse(JSON.stringify({ x: this.x })).x;
        var yb = JSON.parse(JSON.stringify({ y: this.y })).y;
        switch (moveDirection) {
            case Direction.UP:
                yb--;
                break;
            case Direction.DOWN:
                yb++;
                break;
            case Direction.LEFT:
                xb--;
                break;
            case Direction.RIGHT:
                xb++;
                break;
            default:
                break;
        }
        // we don't want to attempt to collide with a nonexistent renderer border
        if ((this.enableCollision && this.currentRenderer) && (yb < 0 || xb < 0 || yb >= this.currentRenderer.height || xb >= this.currentRenderer.width)) {
            // Entity collided with border
            return;
        } else if ((this.enableCollision && this.currentRenderer) && this.currentRenderer.getDataAt(xb, yb) == BlockType.BLOCK) {
            // Entity collided with block
            return;
        }
        this.x = xb;
        this.y = yb;
    }
    setSprite(spr) {
        this.sprite = spr;
    }
    setCollision(col) {
        this.enableCollision = col;
    }
    setVisible(visible) {
        this.visible = visible;
    }
}

module.exports.Entity = Entity;