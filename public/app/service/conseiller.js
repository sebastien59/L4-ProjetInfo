angular.module('ServiceClient').factory('conseillerFactory', function($http, $q){
  var factory = {
    conseillers: {},
    get: function(){
      return factory.conseillers;
    },
    getConseillers: function(){
      var deferred = $q.defer();
      $http.get("/getConseillers").then(function(reponse){
        var result = reponse.data;
        factory.conseillers=result;
        deferred.resolve(result);
      });

      return deferred.promise;
    },
    getConseillersofGroup: function(idgroup){
      var deferred = $q.defer();
      $http.post("/admin/showConseillersgroups",{"groupeId":idgroup}).then(function(reponse){
        var result = reponse.data;
        factory.conseillers=result;
        deferred.resolve(result);
      });

      return deferred.promise;
    },
    getConseillersRestants: function(){
      var deferred = $q.defer();
      $http.get("/admin/showConseillersRestants").then(function(reponse){
        var result = reponse.data;
        factory.conseillers=result;
        deferred.resolve(result);
      });
      return deferred.promise;
    },

    addConseillerGroupe: function(idgroup,items){
      var deferred = $q.defer();
      $http.post("/admin/addConseillerAuGroupe",{groupeId:idgroup, conseillerId:items[0].id}).then(function(reponse){
        var result = reponse.data;
        deferred.resolve(result);
      });
      return deferred.promise;
    }


  };

  return factory;
});
