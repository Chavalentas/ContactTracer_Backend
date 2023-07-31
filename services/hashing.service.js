const bcrypt = require('bcrypt');


const hash = function(passWord){
    return bcrypt.hashSync(passWord,10);
}

const isValid = async function(plainTextPassword, hashedPassword){
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
}

module.exports = {
    hash,
    isValid
}
