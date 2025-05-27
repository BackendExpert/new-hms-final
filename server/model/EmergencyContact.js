const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
    regNo: { type: String, ref: 'Student' },
    firstName: String,
    surname: String,
    relationship: String,
    telNo: String,
    address: {
        houseNo: String,
        street: String,
        locality: String,
        city: String,
        postcode: String
    },
    active: Boolean
});

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
