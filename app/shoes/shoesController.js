'use strict';

var Shoe = require("./shoeModel"),


// creates a shoe
var shoeCreate = function(req, res) {
    var shoe          = new Shoe();   // create a new instance of the Shoe model
    shoe.name         = req.body.name;  // set the shoes name (comes from the request)
    shoe.description  = req.body.description;  // set the shoes description (comes from the request)
    shoe.condtion     = req.body.condition;  // set the shoes password (comes from the request)
    shoe.color        = req.body.color;
    shoe.size         = req.body.size;
    shoe.picture      = req.body.picture;


    shoe.save(function(err) {
        // if (err) {
        //   // duplicate entry
        //   if (err.code == 11000)
        //     return res.json({ success: false, message: 'A user with that username already exists. '});
        //   else
        //     return res.send(err);
        // }

        // return a message
        res.json({ message: 'Shoe created!' });
      });

};

// gets one shoe
var shoeShow = function(req, res) {
  Shoe.findById(req.params.shoe_id, function(err, user) {
        if (err) res.send(err);

        // return that shoe
        res.json(shoe);
  });
};

// gets all shoes
var shoesAll = function(req, res) {
  Shoe.find({}, function(err, shoes) {
        if (err) res.send(err);

        // return the shoes
        res.json(shoes);
  });
}

// updates a shoe
var shoeUpdate = function(req, res) {
  Shoe.findById(req.params.shoe_id, function(err, shoe) {

        if (err) res.send(err);

        // set the new user information if it exists in the request
        if (req.body.name) shoe.name = req.body.name;
        if (req.body.description) shoe.description = req.body.description;
        if (req.body.condition) shoe.condition = req.body.condition;
        if (req.body.color) shoe.color = req.body.color;
        if (req.body.size) shoe.size = req.body.size;
        if (req.body.picture) shoe.picture = req.body.picture;

        // save the shoe
        shoe.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'Shoe updated!' });
        });

  });
}

// deletes the shoe
var shoeDelete = function(req, res) {
  Shoe.remove({
        _id: req.params.shoe_id
      }, function(err, shoe) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
  });
};



// exports module
module.exports = {

  shoeCreate:   shoeCreate,
  shoeShow:     shoeShow,
  shoesAll:     shoesAll,
  shoeUpdate:   shoeUpdate,
  shoeDelete:   shoeDelete
}
