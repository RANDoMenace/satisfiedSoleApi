apiRouter.post('/authenticate', function(req, res) {
    //find the user
    //select the name, username, and pw explicitly
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function(err, user) {

      if (err) throw err;

      //no user with that username was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        //check to see if pw matchec
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong Password'
          });
        } else {
          //if user is found & pw is right make token
          var token = jwt.sign({
            name: user.name,
            usernme: user.username
          }, superSecret, {
            expiresInMinutes: 1440
          });
          //return info including json token
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
  });
});
