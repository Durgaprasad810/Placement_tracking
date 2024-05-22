const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true }, 
  role: { type: String, required: true }, 
  qualificationsRequired: { type: String, required: true }, 
  salary: { type: Number, required: true }, 
  location: { type: String, required: true },
  applicationDeadline: { type: Date, required: true },
  jobDescription: { type: String, required: true }, 
  website: { type: String }, 
  contactEmail: { type: String },
  contactPhone: { type: Number },
  additionalInfo: { type: String } ,
  maxbacklogs:{type:Number},
  appliedStudents:{type:Array},
  selectedStudents:{type:Array}
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
