 // BASE SETUP
 // ======================================

 // CALL THE PACKAGES --------------------
 var express      = require('express'); // call express
 var app          = express(); // define our app using express
 var bodyParser   = require('body-parser'); // get body-parser
 var morgan       = require('morgan'); // used to see requests
 var mongoose     = require('mongoose'); // for working w/ our database = process.env.PORT || 8080; // set the port for our app
 var port         = process.env.PORT || 8080;
 var jwt          = require('jsonwebtoken');
 var superSecret  = 'soleman';


//source in models
 var User         = require('./app/models/user');


  // connect to our database (hosted on modulus.io)
  mongoose.connect('mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o');

 // APP CONFIGURATION ---------------------
 // use body parser so we can grab information from POST requests
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

 // configure our app to handle CORS requests
 app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 Authorization');
 next();
 });

 // log all requests to the console
 app.use(morgan('dev'))
 // ROUTES FOR OUR API
 // =============================

 // basic route for the home page
 app.get('/', function(req, res) {
 res.send('Welcome to the home page!');
 });

 // get an instance of the express router
 var apiRouter = express.Router();

//route for authenticating users
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

 //middleware to use for all requests
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

 // test route to make sure everything is working
 // accessed at GET http://localhost:8080/api
 apiRouter.get('/', function(req, res) {
 res.json({ message: 'hooray! welcome to our api!' });
 });

 // more routes for our API will happen here 47
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

 // REGISTER OUR ROUTES -------------------------------
 // all of our routes will be prefixed with /api
 app.use('/api', apiRouter);





 // START THE SERVER
 // ===============================
 app.listen(port);
 console.log('Magic happens on port ' + port);
