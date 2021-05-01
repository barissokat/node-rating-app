const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', storeController.index);
router.get('/stores', catchErrors(storeController.index));

router.get('/stores/create', 
  authController.isLoggedIn, 
  storeController.create
);

router.post('/stores', 
    authController.isLoggedIn, 
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
router.post('/login', authController.login);

router.get('/register', userController.registerForm);

router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', 
  authController.isLoggedIn, 
  userController.show
);

router.post('/account', catchErrors(userController.update));

router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', 
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

// API
router.get('/api/v1/search', catchErrors(storeController.search));

module.exports = router;
