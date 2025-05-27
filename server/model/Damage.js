const mongoose = require('mongoose');

const damageSchema = new mongoose.Schema({
    regNo: { type: String, ref: 'Student' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    amount: Number,
    description: String
});

module.exports = mongoose.model('Damage', damageSchema);
