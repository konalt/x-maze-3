var keydoors = [];

function onPickupKey(daKey) {
    daKey.setVisible(false);
    daKey.setCollision(false);
    keydoors.forEach(kd => {
        kd.setCollision(false);
    });
}

function registerKeydoor(daKeyDoor) {
    keydoors.push(daKeyDoor);
}

module.exports.pickupKey = onPickupKey;
module.exports.registerKeydoor = registerKeydoor;