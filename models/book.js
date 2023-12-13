const mongoose = require("mongoose");

var BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  comments: [{type: mongoose.Schema.ObjectId, ref: "Comment"}]
});
// Compile model from schema
module.exports = mongoose.model("Book", BookSchema);
