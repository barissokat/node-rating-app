const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', storeController.homePage);
router.get('/store/create', storeController.create);
router.post('/store', catchErrors(storeController.store));

module.exports = router;
