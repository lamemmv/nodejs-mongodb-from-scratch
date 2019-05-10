let mongoose = require('mongoose');

// Article schema
let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    require: true
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
