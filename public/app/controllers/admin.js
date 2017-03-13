'use strict';

app.controller('adminCtrl', function($scope, $location){

    switch($location.path()){
      case '/admin/':
          $scope.active=0
          break;
      case '/admin/gestionnaire':
          $scope.active=1;
        break;
      case '/admin/resultat':
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
                lists: {"A": [], "B": []}
            };

            // Generate initial model
            for (var i = 1; i <= 3; ++i) {
                $scope.models.lists.A.push({label: "Item A" + i});
                $scope.models.lists.B.push({label: "Item B" + i});
            }

            // Model to JSON for demo purpose
            $scope.$watch('models', function(model) {
                $scope.modelAsJson = angular.toJson(model, true);
            }, true);

})

app.controller('resultatCtrl', function($scope, $route){
  $scope.resultats = [
    {id:0, date: '01/03/2017', duree: '20 min', note : 7},
    {id:1, date: '01/03/2017', duree: '17 min', note : 5},
    {id:2, date: '02/03/2017', duree: '15 min', note : 2},
  ]
});

app.controller('gestionnaireCtrl',function($scope, $location){



})
