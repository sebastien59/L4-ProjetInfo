'use strict';

angular.module('ServiceClient').factory('groupFactory', function($http, $q){
  var factory = {
    groups: {},
    get: function(){
      return factory.group;
    },
    getGroups: function(user){
      var deferred = $q.defer();
      $http.post("/admin/showgroups").then(function(reponse){
        var result = reponse.data;
        factory.groups=result;
        deferred.resolve(result);
      });

      return deferred.promise;
    }
  };

  return factory;
});
