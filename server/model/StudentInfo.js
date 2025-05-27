const mongoose = require('mongoose');

const studentInfoSchema = new mongoose.Schema({
    regNo: { type: String, ref: 'Student' },
    medicalCondition: Boolean,
    specialNeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SpecialNeeds' }],
    declaration: String
});

module.exports = mongoose.model('StudentInfo', studentInfoSchema);
