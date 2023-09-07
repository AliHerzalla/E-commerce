const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    google_id: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: String,
        required: false,
    }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;