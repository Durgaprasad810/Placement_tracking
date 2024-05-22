const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyControllers');

router.post('/', companyController.createCompany);

module.exports = router;