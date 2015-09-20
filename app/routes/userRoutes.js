apiRouter.route('/users')

    //create a user
    .post(function(req,res) {
          //create a new instance of the user model
          var user = new User();

          //set the users information(comes from request)
          user.name = req.body.name;
          user.username = req.body.username;
          user.password = req.body.password;

          //saves the user anc checks for errors
          user.save(function(err) {
            if (err) {
              //du[licate entry
              if (err.code == 11000)
                  return res.json({ success: false, message: 'A user with that\
                  username already exists. '});
              else
                  return res.send(err);
                            }

                    res.json({message: 'User created!'});
        });

    })

    //gets all users
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);

            //returns the users
            res.json(users);
        });
    });

  apiRouter.route('/users/:user_id')
      //get the user with that id
      .get(function(req, res) {
          User.findById(req.params.user_id, function(err, user) {
              if (err) res.send(err);

              //returns user
              res.json(user);
          });
      })

      .put(function(req, res) {
          //uses model to find selected user
          User.findById(req.params.user_id, function(err, user) {
              if (err) res.send(err);

              //updates the users info only if its new
              if (req.body.name) user.name = req.body.name;
              if (req.body.username) user.username = req.body.username;
              if (req.body.password) user.password = req.body.password;

              //saves the user
              user.save(function(err) {
                if (err) res.send(err);

                //return a msg
                res.json({ message: 'User updated'});
              });
          });
      })

      //deletes the user with this id
      .delete(function(req, res) {
          User.remove({
              _id: req.params.user_id
          }, function(err, user) {
                if (err) res.send(err);

                res.json({ message: 'Successfully deleted'});
          });
      });

  //api endpoint to get user information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  })
