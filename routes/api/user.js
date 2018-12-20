const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/user');
const checkAuth = require('../middleware/api/check-auth');


//      sign up users
router.post('/signup', userController.signup);


//      Login user
router.post('/login' , userController.login);


//      delete user
router.delete('/:userId', checkAuth ,userController.deleteUser);

module.exports = router;