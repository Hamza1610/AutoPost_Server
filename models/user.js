const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Email: {
        type: String,
    },
    Password: {
        type: String,
    },
    LinkeIn_Token: {
        type: String
    },
    Twitter_X_Token: {
        type: String
    },
    Facebook_Token: {
        type: String
    },
}
,{ timestamps: true }) 
const User = mongoose.model('Users record', UserSchema);

module.exports = User;