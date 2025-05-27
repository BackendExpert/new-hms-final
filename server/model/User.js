const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

});

const User = mongoose.model('User', UserSchema);

module.exports = User;