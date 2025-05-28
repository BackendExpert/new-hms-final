const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/signin')
router.post('/create-permission', authController.createPermissions)

module.exports = router;