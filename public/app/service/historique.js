'use strict';

angular.module('ServiceClient').factory('historiqueFactory', function($http, $q){
  var factory = {
    historique: [],
    get: function(){
      return factory.historique;
    },
    getHistorique: function(){
      var deferred = $q.defer();
      $http.get("/admin/getHistorique").then(function(reponse){
        var result = reponse.data;
        factory.historique=result;
        console.log(result);
        deferred.resolve(result);
      });

      return deferred.promise;
    }
  };

  return factory;
});
