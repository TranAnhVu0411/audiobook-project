const mongoose = require("mongoose");
const {Schema} = mongoose;

const ratingSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }
},{
    timestamps: true,
    versionKey: false
});

ratingSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);