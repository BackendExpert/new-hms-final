const mongoose = require('mongoose');

const specialNeedsSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('SpecialNeeds', specialNeedsSchema);
