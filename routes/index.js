const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
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
router.get('/stores/:slug', storeController.show);
router.get('/stores/:id/edit', catchErrors(storeController.edit));
router.post('/stores/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.update)
);

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister);

module.exports = router;
