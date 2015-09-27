var express   = require('express'); // call express
var apiRouter = express.Router();

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



 apiRouter.use(function(req, res, next) {
      //checl header of url params or post params for token
      var token = req.body.token || req.param('token') || req.headers['x-access-token'];

      //decode token
      if (token) {
        //verifies secrets and checks exp
        jwt.verify(token, superSecret, function(err, decoded) {
          if (err) {
            return res.status(403).send({
              success: false,
              message: 'Failed to auth token'
            });
          } else {
            //if verified save to req for use in other routes
            req.decoded = decoded;
            next();
          }
        });
      } else {
        //if there is no token
        return res.status(403).send({
          success: false,
          message: 'No token provided'
        });
      }

 });
