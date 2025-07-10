const express = require('express');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const checkPermission = require('../middlewares/checkPermissionMiddleware');
const WardenController = require('../controller/wardenController');

const router = express.Router();

router.get('/std-extra-needs', authMiddleware, checkPermission('std-extra-needs'), WardenController.getstdextraneeds)

router.post('/approve-need/:id', authMiddleware, checkPermission('approve-needs'), WardenController.approveneeds)

module.exports = router;