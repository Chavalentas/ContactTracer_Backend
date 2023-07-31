const isLengthValid = function(password, lengthToCheck){
    if (lengthToCheck <= 0){
        throw new Error("The length must be greater than zero!");
    }

    return password.length >= lengthToCheck;
}

const containsUpperCase = function(password){
    return /[A-Z]/.test(password);
}

const containsLowerCase = function(password){
    return /[a-z]/.test(password);
}

const containsDigit = function(password){
    return /\d/.test(password);
}

module.exports = {
    isLengthValid,
    containsUpperCase,
    containsLowerCase,
    containsDigit
}
