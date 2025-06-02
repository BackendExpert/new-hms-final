const express = require('express');
const RoomController = require('../controller/roomController');

const router = express.Router();

router.get('/get-all-rooms', RoomController.getallrooms)

module.exports = router;
