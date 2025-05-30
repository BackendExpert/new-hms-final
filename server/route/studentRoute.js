const express = require('express');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');
const StudentController = require('../controller/studentController');

const router = express.Router();

router.post('/create-student-sheet', authMiddleware, checkPermission('create-student-sheet'), StudentController.createstdviaSheet)

module.exports = router;