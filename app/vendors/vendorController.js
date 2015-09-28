'use strict';

var Vendor = require("./vendorModel"),
    bcrypt = require("bcrypt-nodejs"),
    jwt = require('jsonwebtoken'),
    config = require('../../config'),
    superSecret = config.secret;

//authenticates user
var vendorAuth = function (req, res, next) {
  // find the user
  Vendor.findOne({
      username: req.body.username
    }).select('username password name').exec(function(err, user) {

      if (err) throw err;

      // no vendor with that username was found
      if (!vendor) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (vendor) {

        // check if password matches
        var validPassword = vendor.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign({
            username: vendor.username
          }, superSecret, {
            expiresInMinutes: 43200 // expires in 30 days
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            vendor: vendor
          });
        }

      }

    });
  };

//verifies users token
var tokenVerify = function(req, res, next) {
  // do logging
  console.log('Somebody just accessed the Satisfied Sole API!');

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {

      if (err) {
        res.status(403).send({
          success: false,
          message: 'Failed to authenticate token.'
      });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;

        next(); // make sure we go to the next routes and don't stop here
      }
    });

  } else {

    // if there is no token
    // return an HTTP response of 403 (access forbidden) and an error message
    res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
};

// creates vendor
var vendorCreate = function(req, res) {
    var vendor       = new Vendor();   // create a new instance of the User model
    vendor.name      = req.body.name;  // set the users name (comes from the request)
    vendor.username  = req.body.username;  // set the users username (comes from the request)
    vendor.password  = req.body.password;  // set the users password (comes from the request)
    vendor.zip       = req.body.zip;
    vendor.picture   = req.body.picture;


    vendor.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({ success: false, message: 'A vendor with that username already exists. '});
          else
            return res.send(err);
        }

        // return a message
        res.json({ message: 'Vendor created!' });
      });

};

// gets one vendor
var vendorShow = function(req, res) {
  Vendor.findById(req.params.user_id, function(err, vendor) {
        if (err) res.send(err);

        // return that vendor
        res.json(vendor);
  });
};

// gets all vendors
var vendorsAll = function(req, res) {
  Vendor.find({}, function(err, vendors) {
        if (err) res.send(err);

        // return the users
        res.json(vendors);
  });
}

// updates a vendor
var vendorUpdate = function(req, res) {
  Vendor.findById(req.params.vendor_id, function(err, vendor) {

        if (err) res.send(err);

        // set the new vendor information if it exists in the request
        if (req.body.name) vendor.name = req.body.name;
        if (req.body.username) vendor.username = req.body.username;
        if (req.body.password) vendor.password = req.body.password;
        if (req.body.zip) vendor.zip = req.body.zip;
        if (req.body.picture) vendor.picture = req.body.picture;

        // save the vendor
        vendor.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'Vendor updated!' });
        });

  });
}

// deletes vendor
var vendorDelete = function(req, res) {
  Vendor.remove({
        _id: req.params.vendor_id
      }, function(err, vendor) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
  });
};



// exports module
module.exports = {

  vendorAuth:     vendorAuth,
  tokenVerify:  tokenVerify,
  vendorCreate:   vendorCreate,
  vendorShow:     vendorShow,
  vendorsAll:     vendorsAll,
  vendorUpdate:   vendorUpdate,
  vendorDelete:   vendorDelete
}
