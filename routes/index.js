const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here
router.get('/', storeController.homePage);
router.get('/store/create', storeController.create);
router.post('/store', storeController.store);

module.exports = router;
