const express = require('express');
const RoomController = require('../controller/roomController');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');

const router = express.Router();

router.get('/get-all-rooms', authMiddleware, checkPermission('view-all-rooms'), RoomController.getallrooms)

module.exports = router;
