const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    UserName: {
        type: String,
    },
    Email: {
        type: String,
    },
    Password: {
        type: String,
    },
    LinkeIn: {
        type: String
    },
    Twitter_X: {
        type: String
    },
    Facebook: {
        type: String
    }
}
,{ timestamps: true }) 
const User = mongoose.model('Users record', UserSchema);

module.exports = User;