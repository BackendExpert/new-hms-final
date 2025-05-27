const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    academicYear: String,
    amount: Number,
    type: String,
    note: String
});

module.exports = mongoose.model('Payment', paymentSchema);
