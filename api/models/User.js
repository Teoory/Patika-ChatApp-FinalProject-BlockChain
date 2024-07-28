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
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
    challangeId: {
        type: String,
        default: ''
    },
    // userColor: {
    //     type: String,
    //     enum: ['98f5ff', '#ff0000', '#0000ff', '#008000', '#b22222', '#ff7f50', '#9acd32', '#ff4500', '#2e8b57', '#daa520', '#d2691e', '#5f9ea0', '#1e90ff', '#ff69b4', '#8a2be2', '#00ff7f'],
    //     default: '#98f5ff'
    // }
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;