const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    no: String,
    enrolmentNo: { type: String, unique: true },
    indexNo: String,
    name: String,
    title: String,
    lastName: String,
    initials: String,
    fullName: String,
    alDistrict: String,
    sex: String,
    zScore: Number,
    medium: String,
    nic: String,
    address1: String,
    address2: String,
    address3: String,
    fullAddress: String,
    email: String,
    phone1: String,
    phone2: String,
    genEnglishMarks: Number,
    intake: String,
    dateOfEnrolment: Date,
    distance: Number,
    isAssign: { type: String, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
