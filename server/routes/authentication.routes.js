const express = require('express');

const AuthenticationController = require('../controllers/AuthenticationController');


const router = express.Router();

router.post('/login', AuthenticationController.userLogin);
router.post('/register', AuthenticationController.userRegistration);
router.post('/logout', AuthenticationController.userLogout)
router.post('/auth/password/reset', AuthenticationController.resetPassword)
router.post('/auth/password/update', AuthenticationController.updatePassword)
module.exports = router;