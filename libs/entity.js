const { BlockTypes } = require("./blocktype");
const { Direction } = require("./direction");

class Entity {
    constructor(name = "Unknown Entity " + Math.ceil(Math.random() * 100)) {
        // Gotta be lowercase for console compatibility.
        this.name = name.toLowerCase();
        // Default position. I should make this customizable at some point
        this.x = 0;
        this.y = 0;
        // Default sprite so it actually renders something
        this.sprite = "?";
        // To hide it? Idk why I put this in, it doesn't even do anything yet. (as of 29/07/2021 10:30am)
        this.visible = true;
        // Bool to make sure not to render if out of bounds.
        this.isOutOfBounds = false;
        // Basic collision bool. Mainly for the level editor, but this can be used for other things too
        this.enableCollision = true;
        // This creates a circular. Too bad.
        this.currentRenderer;
        // Make this an object so it's easier to refer to it with just this.collideFunctions[ent.name]
        this.collideFunctions = {};
    }
    setPosition(x, y) {
        // what
        this.x = x;
        this.y = y;
    }
    move(moveDirection) {
        // Clone x and y for collision purposes
        // Return of the collision system in x-maze 2 i guess
        var xb = JSON.parse(JSON.stringify({ x: this.x })).x;
        var yb = JSON.parse(JSON.stringify({ y: this.y })).y;
        // Grid to help with remembering what direction these actually go
        //   X-      X+
        // Y-
        //     swag
        //
        // Y+
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
        } else if ((this.enableCollision && this.currentRenderer) && Object.values(BlockTypes)[this.currentRenderer.getDataAt(xb, yb)].col) {
            // Entity collided with block
            return;
        } else if ((this.enableCollision && this.currentRenderer) && Object.values(this.currentRenderer.entities).find(e => e.x == xb && e.y == yb && e.enableCollision)) {
            // Entity collided with entity
            // Run collision callback first, I'm not a monster
            var e = Object.values(this.currentRenderer.entities).find(e => e.x == xb && e.y == yb && e.enableCollision);
            if (e.collideFunctions[this.name]) {
                e.collideFunctions[this.name]();
            }
            return;
        } else {
            this.x = xb;
            this.y = yb;
        }
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
    setOnCollideWith(ent, callback) {
        // On entity collisions.
        if (this.currentRenderer.entities[ent.name]) {
            this.collideFunctions[ent.name] = callback;
            return true;
        } else {
            return false;
        }
    }
    delete() {
        if (this.name == "player") {
            // No idiot proofing here, you brought this on yourself
            console.error("FATAL: PLAYER ENTITY DELETED!");
            process.exit(1);
        }
        // is there a better way of doing this?
        // who knows
        // undefine it maybe????
        this.currentRenderer.entities[this.name] = undefined;
    }
}

module.exports.Entity = Entity;