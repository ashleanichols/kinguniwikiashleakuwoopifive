const mongoose = require('mongoose')

let editSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  article: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Article'},
  content: {type: mongoose.Schema.Types.String, required: true},
  creationDate: {type: mongoose.Schema.Types.Date, default: Date.now, required: true}
})

let Edit = mongoose.model('Edit', editSchema)
module.exports = Edit
