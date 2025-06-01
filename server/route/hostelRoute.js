const express = require('express');
const HostelController = require('../controller/hostelController');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');

const router = express.Router();

router.get('/get-all-warden', authMiddleware, checkPermission('get-all-warden'), HostelController.GetallWarden)

router.post('/Create-new-hostel', authMiddleware, checkPermission('create-hostel'), HostelController.CreateHostel)

module.exports = router;