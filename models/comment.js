const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    bookId: {
        type: Schema.Types.ObjectId, ref: "Book"
    },
    comment: {
        type: String,
        required: true
    }
});
// Compile model from schema
module.exports = mongoose.model('Comment', CommentSchema );