const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentsControllers');

router.post('/', studentController.createStudent);

module.exports = router;