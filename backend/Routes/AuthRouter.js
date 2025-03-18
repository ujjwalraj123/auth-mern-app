const express = require('express');
const router = express.Router();
const { 
    signup, 
    login, 
    deleteAccount, 
    changeUsername 
} = require('../Controllers/AuthController');
const ensureAuthenticated = require('../Middlewares/Auth');

// Existing routes
router.post('/signup', signup);
router.post('/login', login);

// New protected routes
router.delete('/delete-account', ensureAuthenticated, deleteAccount);
router.put('/change-username', ensureAuthenticated, changeUsername);

module.exports = router;