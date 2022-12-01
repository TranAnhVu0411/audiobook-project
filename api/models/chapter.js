const mongoose = require("mongoose");
const {Schema} = mongoose;

const chapterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    fromPage: {
        type: Number
    },
    toPage: {
        type: Number
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Chapter',  chapterSchema);