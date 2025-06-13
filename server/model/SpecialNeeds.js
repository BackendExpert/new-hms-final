const mongoose = require('mongoose');

const specialNeedsSchema = new mongoose.Schema({
    regNo: { type: String, ref: 'Student' },
    needs: { type: String, required: true },
    isAccpeted: {type: Boolean, default: false }
}, {timestamps: true});

module.exports = mongoose.model('SpecialNeeds', specialNeedsSchema);
