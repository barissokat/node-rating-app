const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', storeController.index);
router.get('/stores', catchErrors(storeController.index));
router.get('/stores/create', storeController.create);
router.post('/stores', 
    storeController.upload, 
    catchErrors(storeController.resize), 
    catchErrors(storeController.store)
);
router.get('/stores/:id/edit', catchErrors(storeController.edit));
router.post('/stores/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.update)
);

module.exports = router;
