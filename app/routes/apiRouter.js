var app = require('express'),
    router = app.Router(),
    UsersCtrl = require('../users/userController'),
    VendorsCtrl = require('../vendors/vendorController'),
    ChatCtrl = require('../chat/chats.controller')
    ShoesCtrl = require('../shoes/shoesController')



// test route to make sure everything is working
// accessed at GET http://localhost:3000/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SatisfiedSole API' });
});

// CRUD Routes

// Shoes CRUD
router.get('/api/shoes',                                      ShoesCtrl.shoesAll);
router.post('/api/shoes',                                   ShoesCtrl.shoeCreate);
router.get('/api/shoes/:shoe_id',                           ShoesCtrl.shoeShow);
router.put('/api/shoes/:shoe_id',                           ShoesCtrl.shoeUpdate);
router.delete('/api/shoes/:shoe_id',                        ShoesCtrl.shoeDelete);

// Users CRUD
router.post('/api/login',                                   UsersCtrl.userAuth);
router.get('/api/users',                                    UsersCtrl.usersAll);
router.post('/api/users',                                   UsersCtrl.userCreate);
router.get('/api/users/:user_id',       UsersCtrl.tokenVerify, UsersCtrl.userShow);
router.put('/api/users/:user_id',       UsersCtrl.tokenVerify, UsersCtrl.userUpdate);
router.delete('/api/users/:user_id',    UsersCtrl.tokenVerify, UsersCtrl.userDelete);

// Vendors CRUD
router.post('/api/login',                                   VendorsCtrl.vendorAuth);
router.get('/api/vendors',                                    VendorsCtrl.vendorsAll);
router.post('/api/vendors',                                   VendorsCtrl.vendorCreate);
router.get('/api/vendors/:vendor_id',       VendorsCtrl.tokenVerify, VendorsCtrl.vendorShow);
router.put('/api/vendors/:vendor_id',       VendorsCtrl.tokenVerify, VendorsCtrl.vendorUpdate);
router.delete('/api/vendors/:vendor_id',    VendorsCtrl.tokenVerify, VendorsCtrl.vendorDelete);



// CHAT CRUD
router.get('/api/games/:game_id/chats/:chat_id',    UsersCtrl.tokenVerify, ChatCtrl.chatShow);
router.post('/api/games/:game_id/chats',            UsersCtrl.tokenVerify, ChatCtrl.chatCreate);
router.put('/api/games/:game_id/chats/:chat_id',    UsersCtrl.tokenVerify, ChatCtrl.chatUpdate);
router.delete('/api/games/:game_id/chats/:chat_id', UsersCtrl.tokenVerify, ChatCtrl.chatDelete);

module.exports = router;
