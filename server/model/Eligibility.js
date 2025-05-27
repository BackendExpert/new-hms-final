const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema({
    regNo: { type: String, ref: 'Student' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    academicYear: String
});

module.exports = mongoose.model('Eligibility', eligibilitySchema);
