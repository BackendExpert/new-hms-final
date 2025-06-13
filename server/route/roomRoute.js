const express = require('express');
const RoomController = require('../controller/roomController');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');

const router = express.Router();

router.get('/get-all-rooms', authMiddleware, checkPermission('view-all-rooms'), RoomController.getallrooms)

router.get('/get-one-room/:id', authMiddleware, checkPermission('get-one-room'), RoomController.getoneRoom)

router.post('/Update-room-capasity', authMiddleware, checkPermission('update-room-capasity'), RoomController.updateRoomCapasity)

router.get('/warden-Rooms', authMiddleware, checkPermission('warden-rooms'), RoomController.wardenRooms)

// router.get('/student-assign-need/:email', authMiddleware, checkPermission('student-assign-need'), RoomController.studentAssignNeed)

router.post('/student-assign-to-rooms', authMiddleware, checkPermission('student-assign-to-rooms'), RoomController.stundetassigntoroom)

module.exports = router;
