const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/signin', authController.signup)
router.post('/create-permission', authController.createPermissions)

module.exports = router;