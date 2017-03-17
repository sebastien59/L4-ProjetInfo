'use strict';

app.controller('adminCtrl', function($scope, $location){

    switch($location.path()){
      case '/admin/':
          $scope.active=0
          break;
      case '/admin/gestionnaire':
          $scope.active=1;
        break;
      case '/admin/historique':
          $scope.active=2;
        break;
      default:
          $scope.active=0;
        break;
    }

    $scope.changeRoute=function(route){
       $location.path(route);
    }


    $scope.models = {
        selected: null,
        lists: {"Groupe": [], "Conseiller": []}
    };

    // Generate initial model
    for (var i = 1; i <= 3; ++i) {
        $scope.models.lists.Groupe.push({label: "Conseiller " + i});
        $scope.models.lists.Conseiller.push({label: "Conseiller " + (i+4)});
    }

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

})

app.controller('historiqueCtrl', function($scope, $route){
  $scope.resultats = [
    {id:0, nom:"Jean", prenom:"Jean", date: '01/03/2017', duree: '20 min', note : 7},
    {id:1, nom:"Jean", prenom:"Baptiste", date: '01/03/2017', duree: '17 min', note : 5},
    {id:2, nom:"Jean", prenom:"Pierre", date: '02/03/2017', duree: '15 min', note : 2},
  ]
});

app.controller('gestionnaireCtrl',function($scope, $location){



})
