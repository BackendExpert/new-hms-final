const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    regNo: { type: String, ref: 'Student' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    academicYear: String,
    inDate: Date,
    outDate: Date,
    note: String,
    active: Boolean
});

module.exports = mongoose.model('Allocation', allocationSchema);
