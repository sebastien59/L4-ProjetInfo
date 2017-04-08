'use strict';

angular.module('ServiceClient').factory('userFactory', function($http, $q){
  var factory = {
    user: {},
    get: function(){
      var deferred = $q.defer();
      $http.get("/user/get").then(function(reponse){
        var result = reponse.data;
        factory.user = result;
        deferred.resolve(result);
      });

      return deferred.promise;
    },
    addUser: function(user){
      var deferred = $q.defer();
      $http.post("/register",{"nom":user.nom,"prenom":user.prenom,"email":user.email,"password":user.password,"passwordConfirm":user.passwordConfirm}).then(function(reponse){
        var result = reponse.data;
        deferred.resolve(result);
      });

      return deferred.promise;
    },
    update: function(user){
      var deferred = $q.defer();
      $http.post("/user/update",{"nom":user.nom,"prenom":user.prenom,"email":user.email,"password":user.password,"passwordConfirm":user.passwordConfirm}).then(function(reponse){
        var result = reponse.data;
        console.log(result);
        deferred.resolve(result);
      });

      return deferred.promise;
    }
  };

  return factory;
});
