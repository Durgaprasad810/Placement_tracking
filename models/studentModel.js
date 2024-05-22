const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  id: { type: String, required: true }, 
  age: { type: Number, required: true }, 
  skills: { type: [String], required: true }, 
  email: { type: String, required: true }, 
 phNo:{type:Number,required:true},
 branch:{ type: String, required: true }, 
 cgpa:{type:Number,required:true},
//  year:{type:Number,required:true},
 backlogs:{type:Number},
 appliedCompanies: { type: [String], required: true }, 
 pdf: {type:Buffer},
});

const student = mongoose.model('Student details', studentSchema);     //It actually makes a collection for us in Mongoose.

module.exports = student;