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
router.post('/create-permission', authMiddleware, checkPermission('create-role-permission'), authController.createPermissions)

router.get('/view-all-role', authMiddleware, checkPermission('view-role-permission'), authController.getallrolesWithPermissions)

router.get('/view-one-role/:id', authMiddleware, checkPermission('view-one-role-permission'), authController.viewoneROleWithPermissions)

router.post('/delete-role-permission', authMiddleware, checkPermission('delete-role-permission'), authController.deleteRolePermission)

router.get('/get-currentuser-data', authMiddleware, checkPermission('view-current-user'), authController.getmebyemail)

router.post('/update-password-dashboard', authMiddleware, checkPermission('update-password-dash'), authController.updatepassviaDash)

module.exports = router;