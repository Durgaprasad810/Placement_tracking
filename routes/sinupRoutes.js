const express = require('express');
const router = express.Router();
const sinupController = require('../controllers/sinupControllers');

router.post('/', sinupController.createlogin);

module.exports = router;