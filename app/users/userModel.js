var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    bcrypt       = require('bcrypt-nodejs'),
    Shoe         = require("../shoes/shoeModel");


// User Schema
var UserSchema   = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, index: { unique: true }},
  password: { type: String, required: true, select: false },
  zip: { type: String, required: true },
  picture: { type: String, required: false },
    shoes: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref:   'Shoe'
  }]

});



// hash the password before the user is saved
UserSchema.pre('save', function(next) {
  var user = this;

  // hash the password only if the password has been changed or user is new
  if (!user.isModified('password')) return next();

  // generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    // change the password to the hashed version
    user.password = hash;
    next();
  });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
