const express = require('express');
const authController = require('../controller/authController');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');

const router = express.Router();

router.post('/signup', authController.signup)

router.post('/verify-email', authController.otpverifyforemail)

router.post('/signin', authController.signin)

router.post('/forgot-password', authController.forgetpass)

router.post('/verify-otp', authController.checkotpforforgetpass)

router.post('/update-password', authController.updatepasswordviaforgetpass)

// admin, director access only
router.post('/create-permission', authMiddleware, checkPermission(['create-role-permission']), authController.createPermissions)

router.post('/view-all-role', authMiddleware, checkPermission(['view-role-permission']), authController.getallrolesWithPermissions)

router.post('/view-one-role', authMiddleware, checkPermission(['view-one-role-permission']), authController.viewoneROleWithPermissions)


module.exports = router;