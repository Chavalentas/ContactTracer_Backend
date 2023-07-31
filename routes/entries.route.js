const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entries.controller');

router.post('/entriesbyuser', entriesController.getEntriesRequest);
router.post('/addentry', entriesController.addEntryRequest);
router.delete('/:id', entriesController.deleteEntryRequest);
router.put('/:id', entriesController.updateEntryRequest);

module.exports = router;