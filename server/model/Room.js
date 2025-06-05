const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomID: { type: String, required: true, unique: true },
    currentOccupants: { type: Number, default: 0 },
    capasity: { type: Number, required: true, default: 4 },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    hostelID: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
    status: {
        type: String,
        enum: ['Availabe', 'Repair', 'Full'],
        default: 'Availabe'
    }
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;