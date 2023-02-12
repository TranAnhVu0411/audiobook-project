const mongoose = require("mongoose");
const {Schema} = mongoose;

const favouriteSchema = new Schema({
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

module.exports = mongoose.model('Favourite', favouriteSchema);