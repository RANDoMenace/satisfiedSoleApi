var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    User         = require("../users/userModel");


// Shoe Schema
var ShoeSchema   = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true},
  condition: { type: String, required: true},
  color: { type: String, required: true, select: false },
  size: { type: String, required: true },
  picture: { type: String, required: true },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
});




module.exports = mongoose.model('Shoe', ShoeSchema);
