var User        = require("../users/userModel"),
    Chat        = require('./chatModel'),
    config      = require('../../config'),
    superSecret = config.secret;



// Creates Chat
var chatCreate = function(req, res) {
    var chat      = new Chat();   // create a new instance of the chat model
    chat.sender   = req.body.sender;
    chat.receiver = req.body.receiver;
    chat.message  = req.body.message;
    chat.read     = false;

    chat.save(function(err) {
        if (err) {
            return res.send(err);
        }

        // return a message
        res.json({ message: 'Message created!' });
      });

};

// Gets Chat
var chatShow = function(req, res) {
  Chat.findById(req.params.chat_id, function(err, chat) {
        if (err) res.send(err);

        // return that chat
        res.json(chat);
  });
};

//||||||||||||||||||||||||||--
// GET ALL CHATS OF A USER
//||||||||||||||||||||||||||--
// var chatsAll = function(req, res) {
//   Chat.find({}, function(err, chats) {
//         if (err) res.send(err);

//         // return the chats
//         res.json(chats);
//   });
// }

// Updates Chat
var chatUpdate = function(req, res) {
  Chat.findById(req.params.chat_id, req.params.game_id, function(err, chat) {

        if (err) res.send(err);

        // set the new chat information if it exists in the request
        if (req.body.chat) chat.message = req.body.message;
        if (req.body.read) chat.read = req.body.read;

        // save the chat
        chat.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'Chat updated!' });
        });

  });
}

// Deletes chat
var chatDelete = function(req, res) {
  Chat.remove({
        _id: req.params.chat_id
      }, function(err, chat) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
  });
}

//||||||||||||||||||||||||||--
// EXPORT MODULE
//||||||||||||||||||||||||||--
module.exports = {

  chatCreate:   chatCreate,
  chatShow:     chatShow,
  chatUpdate:   chatUpdate,
  chatDelete:   chatDelete
}
