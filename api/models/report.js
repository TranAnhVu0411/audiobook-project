const mongoose = require("mongoose");
const {Schema} = mongoose;

const reportSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reportedUser : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reportContent: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'notchecked'
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Report', reportSchema);