angular.module('ServiceClient').factory('conseillerFactory', function($http, $q){
  var factory = {
    conseillers: {},
    get: function(){
      return factory.conseillers;
    },
    getConseillersofGroup: function(idgroup){
      var deferred = $q.defer();
      $http.post("/admin/showConseillersgroups",{"groupeId":idgroup}).then(function(reponse){
        var result = reponse.data;
        factory.conseillers=result;
        deferred.resolve(result);
      });

      return deferred.promise;
    }
  };

  return factory;
});





















