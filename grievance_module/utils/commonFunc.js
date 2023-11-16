const { v4: uuidv4 } = require('uuid');

function generateUUID() {
    return uuidv4();
}


console.log(generateUUID());

module.exports = {
    generateUUID,
}
