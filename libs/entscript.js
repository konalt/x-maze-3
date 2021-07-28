var scripts = [];

class EntityScript {
    constructor() {
        this.attachedEntities = [];
        scripts.push(this);

        this.isActive = false;
    }
    attachToEntity(ent) {
        if (!this.attachedEntities.includes(ent)) {
            ent.scripts.push(this);
            this.attachedEntities.push(ent);
            this.isActive = true;
            this.start();
        }
    }
    update() {
        console.log("defaultupdate");
    }
    start() {
        console.log("defaultstart");
    }
}

module.exports.EntityScript = EntityScript;