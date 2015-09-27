var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// Models
var User = require('../users/userModel');


// Chat Schema
var ChatSchema = new mongoose.Schema({
  sender:   {
            type: mongoose.Schema.Types.ObjectId,
            ref:  'User'
  },
  receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  'User'
  },

  message:  String,
  read:     Boolean
})

module.exports = mongoose.model('Chat', ChatSchema);
