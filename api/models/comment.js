const mongoose = require("mongoose");
const {Schema} = mongoose;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },
    status: {
        type: String,
        required: true,
        default: 'available'
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Comment', commentSchema);