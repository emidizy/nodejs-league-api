const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide your Username']
    },
    email: {
        type: String,
        required: [true, 'Please provide your Email'],
        unique: [true, 'User already registered']
    },
    password: {
        type: String,
        required: [true, 'Please provide your Password']
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: [true]
    }
});

// Mongoose hook. This is executed before a userSchema is created and saved
// UserSchema.pre('save',  function(next) {
//     const user = this
//     bcrypt.hash(user.password, 10 , function (error, encrypted){
//         user.password = encrypted;
//         next();
//     });
// })
module.exports = mongoose.model('Users', UserSchema);