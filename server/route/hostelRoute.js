const express = require('express');
const HostelController = require('../controller/hostelController');

const router = express.Router();

router.get('/get-all-warden', HostelController.GetallWarden)

module.exports = router;