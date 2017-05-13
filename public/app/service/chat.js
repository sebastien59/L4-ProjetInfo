'use strict';

angular.module('ServiceClient').factory('chatsFactory', function($http, $q,$location){
  var factory = {
    chats:[],
    add: function(chat){
      factory.chats.push(chat);
    },
    get: function(){
      return factory.chats;
    },
    getById: function(id){
      for(var chat in factory.chats){
        if(factory.chats[chat].id == id)
          return factory.chats[chat];
      }
      return null;
    },
    sendMessage: function(idChat, message, isConseiller){
      factory.getById(idChat).messages.push({texte: message, isConseiller: isConseiller});
    },
    addMessage: function(idChat, message, isConseiller){
      var chat = factory.getById(idChat)

      if($location.path() != "/conseiller/chat/"+chat.id){
        chat.nonlu++;
        var audio = new Audio('/audio/notification');
        audio.play();
      }
      chat.messages.push({texte: message, isConseiller: isConseiller});
    },
    endChat:function(idChat){
      var chat = factory.getById(idChat);
      factory.chats.splice(factory.chats.indexOf(chat), 1);
    }
  };

  return factory;
});
