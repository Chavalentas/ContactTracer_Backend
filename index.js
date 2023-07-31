const backendConfig = require('./config/backend-config.json');
const dbConfig = require('./config/database-config.json');
const express = require('express');
const mongo = require('mongodb');
const cors = require('cors')
const userRoutes = require('./routes/users.route');
const entryRoutes = require('./routes/entries.route');
const dbService = require("./services/database.service");
const loggerService = require("./services/logging.service");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/entries', entryRoutes);

dbService.initialize().then(() => {
    const listener = app.listen(process.env.PORT || backendConfig.backendPort, () => {
        loggerService.logInfo('The app is listening on port ' + listener.address().port);
    });
}, (error) => {
    throw error;
});