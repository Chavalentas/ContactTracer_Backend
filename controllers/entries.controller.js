const dbService = require("../services/database.service");
const loggerService = require("../services/logging.service");
const idGenerator = require("../services/id-generator.service");
const Entry = require("../models/entry.model");


//POST '/entriesbyuser'
const getEntriesRequest = async (req, res) => {
    try
    {    
        if (req.body.id === 'undefined'){
            throw new Error("The req.body.id was not defined!");
        }

        var users = await dbService.getUsers();
        var userIds = users.map(function(obj) {
            return obj.id;
           });
        
        if (!userIds.includes(req.body.id)){
           throw new Error("The user with the given ID does not exist!");
        }

        dbService.getEntriesByUserId(req.body.id).then((result) => {
         res.status(200).json(result);
       })
       .catch((error) => {
        throw error;
       })
    } catch (e){
        res.status(404).json({message : "The get entries operation failed!:  " + e.message});
    }
};

//POST '/addentry'
const addEntryRequest = async (req, res) => {
    try
    {    
        console.log(req.body);
        if (req.body.userId === 'undefined'){
            throw new Error("The req.body.userId was not defined!");
        }

        if (req.body.firstName === 'undefined'){
            throw new Error("The req.body.firstName was not defined!");
        }

        if (req.body.lastName === 'undefined'){
            throw new Error("The req.body.firstName was not defined!");
        }

        if (req.body.phoneNumber === 'undefined'){
            throw new Error("The req.body.phoneNumber was not defined!");
        }

        if (req.body.timeOfEncounter === 'undefined'){
            throw new Error("The req.body.timeOfEncounter was not defined!");
        }

        if (req.body.image === 'undefined'){
            throw new Error("The req.body.image was not defined!");
        }

        if (req.body.longitude === 'undefined'){
            throw new Error("The req.body.longitude was not defined!");
        }

        if (req.body.latitude === 'undefined'){
            throw new Error("The req.body.latitude was not defined!");
        }

       var entries = await dbService.getEntries();
       var users = await dbService.getUsers();

       var ids = entries.map(function(obj) {
        return obj.id;
       });

       var userIds = users.map(function(obj) {
        return obj.id;
       });

       if (!userIds.includes(req.body.userId)){
        throw new Error("The user with the given ID does not exist!");
       }

       var id = idGenerator.generateId(15, ids);
       var entry = new Entry(id, req.body.userId, req.body.firstName,
        req.body.lastName, req.body.phoneNumber, req.body.timeOfEncounter, req.body.image,
        req.body.longitude, req.body.latitude);

       dbService.insertEntry(entry).then((result) => {
         console.log(result); 
         res.status(201).json({id : id});
       })
       .catch((error) => {
        throw error;
       })
    } catch (e){
        res.status(404).json({message : "The add operation of the entry failed!:  " + e.message});
    }
};

//DELETE '/:id'
const deleteEntryRequest = async (req, res) => {
    try
    {
        if (req.params.id === 'undefined'){
            throw new Error("The req.body.userId was not defined!");
        }

       dbService.deleteEntry(req.params.id).then((success) => {
        if (success){
            res.status(200).json({message : "Deleting of the entry was successful!"});
        }
       })
       .catch((error) => {
         throw error;
       })
    } catch (e){
        res.status(404).json({message : "The delete of the entry failed!:  " + e.message});
    }
};


//PUT '/:id'
const updateEntryRequest = async (req, res) => {
    try
    {
        if (req.params.id === 'undefined'){
            throw new Error("The req.body.userId was not defined!");
        }

        if (req.body.id === 'undefined'){
            throw new Error("The req.body.id was not defined!");
        }

        if (req.body.userId === 'undefined'){
            throw new Error("The req.body.userId was not defined!");
        }

        if (req.body.firstName === 'undefined'){
            throw new Error("The req.body.firstName was not defined!");
        }

        if (req.body.lastName === 'undefined'){
            throw new Error("The req.body.firstName was not defined!");
        }

        if (req.body.phoneNumber === 'undefined'){
            throw new Error("The req.body.phoneNumber was not defined!");
        }

        if (req.body.timeOfEncounter === 'undefined'){
            throw new Error("The req.body.timeOfEncounter was not defined!");
        }

        if (req.body.image === 'undefined'){
            throw new Error("The req.body.image was not defined!");
        }

        if (req.body.longitude === 'undefined'){
            throw new Error("The req.body.longitude was not defined!");
        }

        if (req.body.latitude === 'undefined'){
            throw new Error("The req.body.latitude was not defined!");
        }

        var entryId = req.params.id;

        if (entryId != req.body.id){
            throw new Error("The entry ID in the parameters and the body do not match!");
        }

        var users = await dbService.getUsers();

        var userIds = users.map(function(obj) {
            return obj.id;
           });
    
        if (!userIds.includes(req.body.userId)){
            throw new Error("The user with the given ID does not exist!");
        }

        var newEntry = new Entry(entryId, req.body.userId, req.body.firstName,
         req.body.lastName, req.body.phoneNumber, req.body.timeOfEncounter, req.body.image,
         req.body.longitude, req.body.latitude);
 
        dbService.updateEntry(newEntry, entryId).then((success) => {
            if (success){
                res.status(200).json({message : "Entry was successfully updated!"});
            }
        })
        .catch((error) => {
         throw error;
        })
    } catch (e){
        res.status(404).json({message : "The update of the entry failed!:  " + e.message});
    }
};

//export controller functions
module.exports = {
    addEntryRequest,
    getEntriesRequest, 
    updateEntryRequest,
    deleteEntryRequest
};