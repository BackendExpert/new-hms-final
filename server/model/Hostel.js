const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    hostelID: String,
    name: String,
    location: String,
    gender: String,
    roomCount: Number,
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    warden: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Hostel', hostelSchema);
