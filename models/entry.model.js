class Entry{
    constructor(id, userId, firstName, lastName, phoneNumber, timeOfEncounter, image, longitude, latitude){
        this.id = id;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.timeOfEncounter = timeOfEncounter;
        this.image = image;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}

module.exports = Entry;