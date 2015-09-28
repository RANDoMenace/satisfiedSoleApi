// packages
var express      = require('express'),
    path         = require('path'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    app          = express(),
    config       = require('./config'),
    mongoose     = require('mongoose');


// Connect DB
mongoose.connect(config.databaseURI);

// View Engine Set-up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logs request to console
app.use(logger('dev'));

// Grabs info from POST req w/ body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Configs app to handle CORS req
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
var apiRouter = require('./app/routes/apiRouter');
app.use('/', apiRouter);

// this is an example of auth middleware
// app.use(function(req, res, next) {
//   //verify token here

// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
