// backend/src/routes/index.js
const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/index');

// Define routes
router.get('/users', getUsers);
router.post('/users', createUser);

module.exports = router;