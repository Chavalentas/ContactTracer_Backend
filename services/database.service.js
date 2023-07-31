const dbConfig = require('../config/database-config.json');
const mongo = require('mongodb');
const User = require("../models/user.model");
const Entry = require('../models/entry.model');
const loggerService = require("./logging.service");


const initialize = async function(){
    return new Promise(function(resolve, reject){
        createDatabase().then((client) =>{
            createCollections().then((collections) =>{
                loggerService.logInfo(`Collections in the database '${dbConfig.databaseName}' were successfully created!`)
                resolve(collections);
            })
            .catch((error) => {
                loggerService.logError(error.message);
                reject(error);
            });
        })
        .catch((error) =>{
            loggerService.logError(error.message);
            reject(error);
        });
    });
}

const insertUser = async function(user){
    return new Promise(function(resolve, reject){
        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then((client) => {
            var db = client.db(dbConfig.databaseName);
            var userToInsert = new User(user.id, user.username, user.password);
            db.collection("users").insertOne(userToInsert).then((inserted) => {
                loggerService.logInfo(`The user with ID '${user.id}' was successfully inserted into the collection 'users' in the database '${dbConfig.databaseName}'!`);
                client.close();
                resolve(inserted);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const getUsers = async function(){
    return new Promise(function(resolve, reject){
        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then((client) => {
            var db = client.db(dbConfig.databaseName);
            db.collection("users").find({}, {projection: {_id : 0}}).toArray().then((result) => {  
                loggerService.logInfo(`The entries from the collection 'users' in the database '${dbConfig.databaseName}' were successfully fetched!`);       
                client.close();
                resolve(result);
            })
            .catch((error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const insertEntry = async function(entry){
    return new Promise(function(resolve, reject){
        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then((client) => {
            var db = client.db(dbConfig.databaseName);
            var entryToInsert = new Entry(entry.id, entry.userId, entry.firstName, entry.lastName, entry.phoneNumber, entry.timeOfEncounter,
                 entry.image, entry.longitude, entry.latitude);
            db.collection("entries").insertOne(entryToInsert).then((inserted) => {
                loggerService.logInfo(`The entry with ID '${entry.id}' was successfully inserted into the collection 'entries' in the database '${dbConfig.databaseName}'!`);
                client.close();
                resolve(inserted);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const updateEntry = async function(entry, entryId){
    return new Promise(function(resolve, reject){
        if (entry.id != entryId){
            reject("The IDs do not match!");
        }

        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then((client) => {
            var idQuery = {id : entryId};
            var newValues = {$set: {userId : entry.userId, firstName : entry.firstName, lastName : entry.lastName, phoneNumber : entry.phoneNumber, timeOfEncounter : entry.timeOfEncounter, image : entry.image, longitude : entry.longitude, latitude : entry.latitude}};
            var db = client.db(dbConfig.databaseName);
            db.collection("entries").updateOne(idQuery, newValues).then((updated) => {
                loggerService.logInfo(`The entry with ID '${entryId}' was successfully updated in the collection 'entries' in the database '${dbConfig.databaseName}'!`);
                client.close();
                resolve(true);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const deleteEntry = async function(entryId){
    return new Promise(function(resolve, reject){
        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then((client) => {
            var idQuery = {id : entryId};
            var db = client.db(dbConfig.databaseName);
            db.collection("entries").deleteOne(idQuery).then((deleted) => {
                loggerService.logInfo(`The entry with ID '${entryId}' was successfully deleted from the collection 'entries' in the database '${dbConfig.databaseName}'!`);
                client.close();
                resolve(true);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const getEntries = async function(){
    return new Promise(function(resolve, reject){
        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then((client) => {
            var db = client.db(dbConfig.databaseName);
            db.collection("entries").find({}, {projection: {_id : 0}}).toArray().then((result) => {         
                loggerService.logInfo(`The entries from the collection 'entries' in the database '${dbConfig.databaseName}' were successfully fetched!`); 
                client.close();
                resolve(result);
            })
            .catch((error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const getEntriesByUserId = async function(userId){
    return new Promise(function(resolve, reject){
        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then((client) => {
            var db = client.db(dbConfig.databaseName);
            db.collection("entries").find({userId : userId}, {projection: {_id : 0}}).toArray().then((result) => {     
                loggerService.logInfo(`The entries from the collection 'entries' in the database '${dbConfig.databaseName}' for the user with ID '${userId}' from the collection 'users' in the database '${dbConfig.databaseName}' were successfully fetched!`);     
                client.close();
                resolve(result);
            })
            .catch((error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

async function createDatabase(){
    return new Promise(function(resolve, reject){
        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then((client) => {
            loggerService.logInfo(`Database '${dbConfig.databaseName}' was successfully created!`);
            client.close();
            resolve(client);
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

async function createCollections(){
    return new Promise(async function(resolve, reject){
        var collections = dbConfig.databaseCollections;
        for (const collName of collections){
            await createCollection(collName).then((collection) =>{
                loggerService.logInfo(`Collection '${collName}' in the database '${dbConfig.databaseName}' was successfully created!`);
            })
            .catch((error =>{
                loggerService.logError(error.message);
                reject(error);
            }));
        }

        resolve(collections);
    });
}

async function createCollection(collectionName){
    return new Promise(function(resolve, reject){
        if (collectionName == null || collectionName === undefined){
            reject("The collectionName cannot be empty!");
            return;
        }

        const mongoString = process.env.DATABASE_URL;
        var client = new mongo.MongoClient(mongoString + `${dbConfig.databaseName}`);
        client.connect().then(async (client) => {
            var db = client.db(dbConfig.databaseName);

            var collections = await client.db().listCollections().toArray();
            var collectionNames = collections.map(c => c.name);

            if (collectionNames.some(n => n == collectionName)){
                resolve(collectionName);
                return;
            }

            db.createCollection(collectionName).then((collection) => {
                client.close();
                resolve(collectionName);
            }).
            catch((error => {
                loggerService.logError(error.message);
                reject(error);
            }))
        }).catch((error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

module.exports = {
    initialize,
    insertUser,
    getUsers,
    insertEntry,
    updateEntry,
    deleteEntry,
    getEntries,
    getEntriesByUserId
}