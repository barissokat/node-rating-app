const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', storeController.index);
router.get('/stores/create', storeController.create);
router.post('/stores', catchErrors(storeController.store));
router.get('/stores', catchErrors(storeController.index));

module.exports = router;
