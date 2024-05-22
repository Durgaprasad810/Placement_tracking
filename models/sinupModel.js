const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    username: { type: String, required: true }, 
    id: { type: String, required: true },                  
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },

});

const LoginDetails = mongoose.model('Signup', loginSchema);

module.exports = LoginDetails;
