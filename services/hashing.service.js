const bcrypt = require('bcryptjs');


const hash = function(passWord){
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(passWord,salt);
}

const isValid = async function(plainTextPassword, hashedPassword){
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
}

module.exports = {
    hash,
    isValid
}
