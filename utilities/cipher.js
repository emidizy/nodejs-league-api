
const bcrypt = require('bcryptjs');

function hash(stringToHash){
    return bcrypt.hashSync(stringToHash, 10);
}

function verifyHash(value, hashedValue){
    return  bcrypt.compareSync(value, hashedValue);
}

module.exports ={
    hash,
    verifyHash
}