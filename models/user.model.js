const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        token: [
            {
                token: {
                    type: String,
                    required: true,
                },
            }
        ]

    })
);

module.exports = User;