'use strict';

app.controller('conseillerCtrl', function($scope, $location){
    
    switch($location.path()){
      case '/conseiler/':
      case '/conseiler/moncompte':
          $scope.active=0;
        break;
      case '/conseiller/resultat':
          $scope.active=1;
        break;
      default:
          $scope.active=0;
        break;
    }

  $scope.chats=[{id: 1},{id: 2}]

  $scope.changeRoute=function(route){
     $location.path(route);
  }
})

app.controller('chatCtrl', function($scope){

});
