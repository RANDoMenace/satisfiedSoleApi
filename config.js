module.exports = {
  'port': process.env.PORT || 3000,
  'databaseURI': process.env.MONGOLAB_URI || 'mongodb://localhost/satisfiedSole_api',
  'secret': 'satisfyMySole'
};
