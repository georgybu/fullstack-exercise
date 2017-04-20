const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  updatedAt: Date,
  comment: String,
  email: String,
  ratings: [Number]
});

module.exports = mongoose.model('Comment', commentSchema);
