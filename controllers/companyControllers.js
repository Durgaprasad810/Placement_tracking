const company = require('../models/companyModel')

const Joi = require('joi');

const createCompany = async (req, res) => {
    const { companyName, role, qualificationsRequired, salary, location, applicationDeadline, jobDescription, website, contactEmail,  contactPhone, additionalInfo,maxbacklogs,appliedStudents} = req.body;

const { error } = Joi.object({
    companyName: Joi.string().required(),
    role: Joi.string().required(),
    qualificationsRequired: Joi.string().required(),
    salary: Joi.number().required(),
    location: Joi.string().required(),
    applicationDeadline: Joi.date().required(),
    jobDescription: Joi.string(),
    website: Joi.string().required(),
    contactEmail: Joi.string().email().required(),
    contactPhone: Joi.number().required(),
    additionalInfo: Joi.string(),
    maxbacklogs:Joi.number().required(),
    appliedStudents:Joi.string(),
}).validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const newCompany = new company({
            companyName, role, qualificationsRequired, salary, location, applicationDeadline, jobDescription, website, contactEmail,  contactPhone, additionalInfo,maxbacklogs,appliedStudents
        });

        await newCompany.save();

        res.status(201).json(newCompany);
    } catch (error) {
        console.error('Error creating company:', error.message);
        res.status(500).send('Not created your id');
    }
};


module.exports = {
    createCompany,
};
