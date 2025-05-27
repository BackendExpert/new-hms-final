const mongoose = require('mongoose');

const wardenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
    startDate: Date,
    note: String,
    active: Boolean
});

module.exports = mongoose.model('Warden', wardenSchema);
