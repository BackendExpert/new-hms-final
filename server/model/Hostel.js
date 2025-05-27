const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    name: String,
    type: String,
    location: String,
    gender: String,
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    warden: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Hostel', hostelSchema);
