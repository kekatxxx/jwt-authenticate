const express = require('express');
const authorize = require('../middleware/authorize');

const userController = require('../controllers/user');

const router = express.Router();

//router.get('/users', authorize('admin'), userController.getUsers);

router.get('/name', authorize(), userController.getName);

router.put('/name', authorize(), userController.updateName);

module.exports = router;