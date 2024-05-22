const student = require('../models/studentModel');
const Joi = require('joi');

const createStudent = async (req, res) => {
    const { name, age, id , skills, email, phNo, branch, cgpa,backlogs,pdf} = req.body;

    // Validate user input
    const { error } = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().min(18).max(120).required(),
        id: Joi.string().required(),
        skills: Joi.array().items(Joi.string()).required(), 
        email: Joi.string().required(),
        phNo: Joi.number().integer().required(),
        branch: Joi.string().required(),
        cgpa: Joi.number().integer().min(0).max(10).required(),
        backlogs:Joi.number().required(),
    }).validate({ name, age, id, skills, email, phNo, branch, cgpa });

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const newStudent = new student({
            name,
            age,
            id,
            skills,
            email,
            phNo,
            branch,
            cgpa,
            backlogs
        });

        await newStudent.save();

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error.message);
        res.status(500).send('Not created your id');
    }
};


module.exports = {
    createStudent,
};
