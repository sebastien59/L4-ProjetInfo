'use strict';

app.controller('conseillerCtrl', function($scope, $location, chatsFactory, userFactory){
  $scope.user={}
  $scope.user.password != '';
  $scope.user.passwordConfirm != '';

  switch($location.path()){
    case '/conseiler/':
    case '/conseiler/moncompte':
        $scope.active=0;
      break;
    case '/conseiller/historique':
        $scope.active=1;
      break;
    default:
        $scope.active=0;
      break;
  }

  $scope.chats=chatsFactory.get();

  userFactory.get().then(function(reponse){
    $scope.user = reponse;
    $scope.user.password = '';
    $scope.user.passwordConfirm = '';
  });

  $scope.updateUser = function(){
    console.log($scope.user);
    userFactory.update($scope.user);
  }

  $scope.changeRoute=function(route){
     $location.path(route);
  }
})

app.controller('chatCtrl', function($scope, $route, chatsFactory, userFactory){
  $scope.id = $route.current.params.id;

  $scope.user = userFactory.get();
  $scope.chat=chatsFactory.getById($scope.id);

  $scope.sendMessage = function(message){
    chatsFactory.sendMessage($scope.id, message, $scope.user);
    $scope.inputMessage = "";
  }
});

app.controller('historiqueCtrl', function($scope, $route, chatsFactory, userFactory){
  $scope.resultats = [
    {id:0, date: '01/03/2017', duree: '20 min', note : 7},
    {id:1, date: '01/03/2017', duree: '17 min', note : 5},
    {id:2, date: '02/03/2017', duree: '15 min', note : 2},
  ]
  $scope.chats=chatsFactory.get();
});
