const express = require('express');
const HostelController = require('../controller/hostelController');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');

const router = express.Router();

router.get('/get-all-warden', authMiddleware, checkPermission('get-all-warden'), HostelController.GetallWarden)

router.post('/Create-new-hostel', authMiddleware, checkPermission('create-hostel'), HostelController.CreateHostel)

router.get('/get-all-hostels', authMiddleware, checkPermission('get-all-hostels'), HostelController.getAllhostel)

router.get('/View-one-hostel/:id', authMiddleware, checkPermission('view-one-hostel'), HostelController.getoneHostel)

router.post('/update-room-count/:id', authMiddleware, checkPermission('update-room-count'), HostelController.updateRoomCount)

router.post('/assign-new-warden', authMiddleware, checkPermission('assign-new-warden'), HostelController.assignNewWarden)

module.exports = router;