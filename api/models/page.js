const mongoose = require("mongoose");
const {Schema} = mongoose;

const pageSchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    chapter: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter'
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Page',  pageSchema);