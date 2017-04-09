'use strict';

angular.module('ServiceClient').factory('groupFactory', function($http, $q){
  var factory = {
    groups: [],
    get: function(){
      return factory.groups;
    },
    getGroups: function(){
      var deferred = $q.defer();
      $http.post("/admin/showgroups").then(function(reponse){
        var result = reponse.data;
        factory.groups=result;
        console.log(factory.groups)
        deferred.resolve(result);
      });

      return deferred.promise;
    },
    create: function(nomGroupe){
      var deferred = $q.defer();
      $http.post("/admin/addgroup", {"nomGroupe": nomGroupe}).then(function(reponse){
        var result;
        if(reponse.result == undefined){
          result = reponse.data;
          console.log(result)
          factory.groups.push(reponse.data);
        }else{
          result = reponse;
        }

        deferred.resolve(result);
      });

      return deferred.promise;
    }
  };

  return factory;
});
