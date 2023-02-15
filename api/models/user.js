const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: 'available',
        required: true
    },
    violatedCount: {
        type: Number,
        default: 0,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);