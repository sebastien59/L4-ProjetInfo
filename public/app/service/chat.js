'use strict';

angular.module('ServiceClient').factory('chatsFactory', function($http, $q){
  var factory = {
    chats:[
      {
        id:0,
        idClient: 1,
        user: {id:3, prenom: 'José', nom: 'Jean'},
        conseiller: {id:2, prenom: 'Sebastien'},
        date : '02/03/2017',
        messages:[
          {texte: 'Bonjour', idSender: 3},
          {texte: 'Bon, puis-je vous aider ?', idSender: 2},
          {texte: 'J\'ai un problème avec ma commande', idSender: 3},
          {texte: 'Pouvez-vous me donner le numéro ?', idSender: 2},
        ]
      },
      {
        id:1,
        idClient: 1,
        user: {id:3, prenom: 'José', nom: 'Jean'},
        conseiller: {id:2, prenom: 'Sebastien'},
        date : '02/03/2017',
        messages:[
          {texte: 'Bonjour', idSender: 3},
          {texte: 'Bon, puis-je vous aider ?', idSender: 2},
          {texte: 'J\'ai un problème avec ma commande', idSender: 3},
          {texte: 'Pouvez-vous me donner le numéro ?', idSender: 2},
        ]
      }
    ],
    get: function(){
      return factory.chats;
    },
    getById: function(id){
      return factory.chats[id];
    },
    sendMessage: function(idChat, message, user){
      factory.chats[idChat].messages.push({texte: message, idSender: user.id});
    }
  };

  return factory;
});
