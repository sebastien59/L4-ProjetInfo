'use strict';

angular.module('ServiceClient').factory('userFactory', function($http, $q){
  var factory = {
    user: {
        id:2,
        prenom: 'Conseiller',
        nom: 'Test'
      },
    get: function(){
      return factory.user;
    }
  };

  return factory;
});
