const express = require('express');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');
const StudentController = require('../controller/studentController');
const upload = require('../middlewares/UploadMiddleware');

const router = express.Router();

router.post('/create-student-sheet', authMiddleware, upload.single('file'), checkPermission('create-student-sheet'), StudentController.createstdviaSheet)

module.exports = router;