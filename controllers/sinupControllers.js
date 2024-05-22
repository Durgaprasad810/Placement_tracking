const login = require('../models/sinupModel')

const Joi = require('joi');


const createlogin= async (req, res) => {
    const {username,id,password,confirmpassword} = req.body;

const { error } = Joi.object({
    username: Joi.string().required(),
    id: Joi.string().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.string().required(),
}).validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const newlogin = new login({
            username,id,password,confirmpassword
        });

        await newlogin.save();

        res.status(201).json(newlogin);
    } catch (error) {
        console.error('Error creating login credits:', error.message);
        res.status(500).send('Not created your id');
    }
};


module.exports = {
    createlogin,
};