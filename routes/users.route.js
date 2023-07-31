const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.post('/userid', usersController.verifyRequest);
router.post('/login', usersController.loginRequest);
router.post('/register', usersController.registerRequest);
router.delete('/:id', usersController.deleteRequest);
router.put('/:id', usersController.updateRequest);

module.exports = router;