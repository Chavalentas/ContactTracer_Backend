const dbService = require("../services/database.service");
const hashingService = require("../services/hashing.service");
const passwordChecker = require("../services/password-checker.service");
const idGenerator = require("../services/id-generator.service");
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

//POST '/userid'
const verifyRequest = async (req, res) => {
    try
    {
        var token = req.body.token;
        var decodedToken;
        jwt.verify(token, 'secret', function(err, tokendata){
            if(err){
                return response.status(400).json({error:' Unauthorized request'});
             }

              if(tokendata){
                decodedToken = tokendata;
              }
        })
    
        res.status(200).json({id : decodedToken.id});
    } catch (e){
        res.status(404).json({message : "Token verification failed!:  " + e.message});
    }
};

//POST '/login'
const loginRequest = async (req, res) => {
    try
    {
        var users = await dbService.getUsers();

        var usernames = users.map(function(obj) {
         return obj.username;
        });
 
        var username = req.body.username;
        var password = req.body.password;
 
        if (username === 'undefined'){
           throw new Error("The username was not defined!");
        }
 
        if (password === 'undefined'){
           throw new Error("The password was not defined!");
        }
 
        if (username.length == 0){
           throw new Error("The username cannot be empty!");
        }
 
        if (!passwordChecker.isLengthValid(password, 8)){
           throw new Error("The length of the password must be at least 8!");
        }
 
        if (!passwordChecker.containsUpperCase(password)){
           throw new Error("The password must contain at least one uppercase character!");
        }
 
        if (!passwordChecker.containsLowerCase(password)){
            throw new Error("The password must contain at least one lowercase character!");
        } 
        
        if (!passwordChecker.containsDigit(password)){
            throw new Error("The password must contain at least one digit!");
        }   
 
        if (!usernames.includes(username)){
           throw new Error("The username cannot  be found!");
        }

        var user = users.find((u) => u.username === username);

        hashingService.isValid(password, user.password).then((valid) => {
            if (valid){         
               var token = jwt.sign({id:user.id},'secret', {expiresIn : '3h'});
               res.status(200).json({token: token});
            }
            else{
                res.status(404).json({message : "Login failed!:  " + "Wrong password"});
            }
        })
        .catch((err) => {
            throw err;
        })
    } catch (e){
        res.status(404).json({message : "Login failed!:  " + e.message});
    }
};


//POST '/register'
const registerRequest = async (req, res) => {
    try
    {    
       var users = await dbService.getUsers();

       var usernames = users.map(function(obj) {
        return obj.username;
       });

       var ids = users.map(function(obj) {
        return obj.id;
       });


       var username = req.body.username;
       var password = req.body.password;

       if (username == null || username === 'undefined'){
          throw new Error("The username was not defined!");
       }

       if (password == null || password === 'undefined'){
          throw new Error("The password was not defined!");
       }

       if (username.length == 0){
          throw new Error("The username cannot be empty!");
       }

       if (!passwordChecker.isLengthValid(password, 8)){
          throw new Error("The length of the password must be at least 8!");
       }

       if (!passwordChecker.containsUpperCase(password)){
          throw new Error("The password must contain at least one uppercase character!");
       }

       if (!passwordChecker.containsLowerCase(password)){
           throw new Error("The password must contain at least one lowercase character!");
       } 
       
       if (!passwordChecker.containsDigit(password)){
           throw new Error("The password must contain at least one digit!");
       }   

       if (usernames.includes(username)){
          throw new Error("The username already exists!");
       }

       var passwordHashed = hashingService.hash(password);
       var id = idGenerator.generateId(15, ids);
       var testUser = new User(id, username, passwordHashed);

       dbService.insertUser(testUser).then((result) => {
         console.log(result); 
         res.status(201).json({message : "User was successfully registered!"});
       })
       .catch((error) => {
        throw error;
       })
    } catch (e){
        res.status(404).json({message : "Register failed!:  " + e.message});
    }
};

//DELETE '/:id'
const deleteRequest = (req, res) => {
    try
    {
       res.json({message : "success"});
    } catch (e){
        res.status(404).send("Delete failed!");
    }
};


//PUT '/:id'
const updateRequest = (req, res) => {
    try
    {
       res.json({message : "success"});
    } catch (e){
        res.status(404).send("Delete failed!");
    }
};

//export controller functions
module.exports = {
    verifyRequest,
    loginRequest, 
    registerRequest,
    deleteRequest,
    updateRequest
};