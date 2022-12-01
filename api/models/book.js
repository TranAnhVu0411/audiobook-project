const mongoose = require("mongoose");
const {Schema} = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    authors: [],
    description: {
        type: String
    },
    categories: [],
    image: {
        type: String
    },
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Book', bookSchema);