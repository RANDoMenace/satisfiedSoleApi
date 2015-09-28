var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    bcrypt       = require('bcrypt-nodejs');

// Vendor Schema
var VendorSchema   = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, index: { unique: true }},
  password: { type: String, required: true, select: false },
  zip: { type: String, required: true },
  picture: { type: String, required: false }
});



// hash the password before the user is saved
VendorSchema.pre('save', function(next) {
  var vendor = this;

  // hash the password only if the password has been changed or user is new
  if (!vendor.isModified('password')) return next();

  // generate the hash
  bcrypt.hash(vendor.password, null, null, function(err, hash) {
    if (err) return next(err);

    // change the password to the hashed version
    vendor.password = hash;
    next();
  });
});

// method to compare a given password with the database hash
VendorSchema.methods.comparePassword = function(password) {
  var vendor = this;

  return bcrypt.compareSync(password, vendor.password);
};

module.exports = mongoose.model('Vendor', VendorSchema);
