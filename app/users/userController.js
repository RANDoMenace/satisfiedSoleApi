'use strict';

var User = require("./user.model"),
    bcrypt = require("bcrypt-nodejs"),
    jwt = require('jsonwebtoken'),
    config = require('../../config'),
    superSecret = config.secret;

//authenticates user
var userAuth = function (req, res, next) {
  // find the user
  User.findOne({
      username: req.body.username
    }).select('username password name').exec(function(err, user) {

      if (err) throw err;

      // no user with that username was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {

        // check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign({
            username: user.username
          }, superSecret, {
            expiresInMinutes: 43200 // expires in 30 days
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            user: user
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

// creates user
var userCreate = function(req, res) {
    var user       = new User();   // create a new instance of the User model
    user.name      = req.body.name;  // set the users name (comes from the request)
    user.username  = req.body.username;  // set the users username (comes from the request)
    user.password  = req.body.password;  // set the users password (comes from the request)
    user.zip       = req.body.zip;
    user.picture   = req.body.picture;


    user.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({ success: false, message: 'A user with that username already exists. '});
          else
            return res.send(err);
        }

        // return a message
        res.json({ message: 'User created!' });
      });

};

// gets one user
var userShow = function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // return that user
        res.json(user);
  });
};

// gets all users
var usersAll = function(req, res) {
  User.find({}, function(err, users) {
        if (err) res.send(err);

        // return the users
        res.json(users);
  });
}

// updates a user
var userUpdate = function(req, res) {
  User.findById(req.params.user_id, function(err, user) {

        if (err) res.send(err);

        // set the new user information if it exists in the request
        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;
        if (req.body.zip) user.zip = req.body.zip;
        if (req.body.picture) user.picture = req.body.picture;

        // save the user
        user.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'User updated!' });
        });

  });
}

// deletes user
var userDelete = function(req, res) {
  User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
  });
};



// exports module
module.exports = {

  userAuth:     userAuth,
  tokenVerify:  tokenVerify,
  userCreate:   userCreate,
  userShow:     userShow,
  usersAll:     usersAll,
  userUpdate:   userUpdate,
  userDelete:   userDelete
}
