const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        enum: ['student', 'warden', 'admin', 'director'],
        default: 'student'
    },
    permissions: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
