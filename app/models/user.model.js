const mongoose = require('mongoose');
const validator = require('validator');
const ROLES_LIST = require('../../config.js/roles_list');
const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: [true, 'The First Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'The Last Name is required']
    },
    email: {
        type: String,
        required: [true, "The Email is required"],
        unique: [true, 'This Email is already exist'],
        validate: [
            {validator: validator.isEmail, message: 'field must be an email.'},
        ]
    },
    password: {
        type: String,
        require: [true, "The Password is required"],
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: ROLES_LIST,
        default: ROLES_LIST.USER
    },
    avatar: {
        type: String,
        default: "uploads/defaultAvatar.jpg"
    }
});

module.exports = mongoose.model('User', userSchema);