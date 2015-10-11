var rp = require('request-promise');
var config = require('./config.js');

var keywords = "nike%20shoes"
var appID = config.ebayAPIKey;
var url = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=' + appID + '&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=' + keywords;

var promise = rp(url)
    .then(function(data){
      console.log(JSON.stringify(data));
    });


