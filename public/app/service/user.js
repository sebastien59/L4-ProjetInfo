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
    },
    addUser: function(user){
      var deferred = $q.defer();
      $http.post("/register",{"nom":user.nom,"prenom":user.prenom,"email":user.email,"password":user.password,"passwordConfirm":user.passwordConfirm}).then(function(reponse){
        var result = reponse.data;
        deferred.resolve(result);
      });

      return deferred.promise;
    }
  };

  return factory;
});
