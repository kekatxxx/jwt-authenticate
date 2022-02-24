const express = require('express');
const authorize = require('../middleware/authorize');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/name', authorize('Admin'), userController.getName);

router.put('/name', authorize(), userController.updateName);

module.exports = router;