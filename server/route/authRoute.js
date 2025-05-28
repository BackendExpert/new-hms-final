const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/signup', authController.signup)
router.post('/verify-email', authController.otpverifyforemail)

router.post('/signin', authController.signin)

router.post('/forgot-password', authController.forgetpass)

router.post('/verify-otp', authController.checkotpforforgetpass)

router.post('/update-password', authController.updatepasswordviaforgetpass)

// admin, director access only
router.post('/create-permission', authController.createPermissions)

module.exports = router;