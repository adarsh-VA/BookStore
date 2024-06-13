const express = require('express');
const router = express.Router();
const { addLocation, allLocations } = require('../controllers/store.controller');

// User routes
router.post('/addLocation', addLocation);
router.get('/locations', allLocations);

module.exports = router;
