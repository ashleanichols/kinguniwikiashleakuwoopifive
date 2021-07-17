const mongoose = require('mongoose')

let articleSchema = new mongoose.Schema({
  title: { type: mongoose.Schema.Types.String, required: 'Title is required.', unique: true },
  lockedStatus: {type: mongoose.Schema.Types.Boolean, default: false, required: true},
  edits: [{type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Edit'}],
  creationDate: {type: mongoose.Schema.Types.Date, default: Date.now, required: true}
})

let Article = mongoose.model('Article', articleSchema)
module.exports = Article
