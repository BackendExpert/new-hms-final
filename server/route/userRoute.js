const express = require('express');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');
const UserController = require('../controller/userController');

const router = express.Router();

router.get('/view-all-users', authMiddleware, checkPermission('view-all-users'), UserController.getallusers)

router.get('/view-one-user/:id', authMiddleware, checkPermission('view-one-user'), UserController.getoneuser)

router.post('/update-user-status/:id', authMiddleware, checkPermission('update-user-status'), UserController.avtiveAnddactiveUser)

router.post('/update-user-role', authMiddleware, checkPermission('update-user-role'), UserController.updateUserRole)

module.exports = router;