const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Please provide a username']
    },
    generatedUsername: {
        type: String,
        required: [true, 'Please provide a new username']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: [String],
        enum: ['admin', 'moderator', 'premium', 'user', 'quest'],
        default: ['quest']
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false 
    },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;