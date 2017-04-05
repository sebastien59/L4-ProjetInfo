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


})

app.controller('historiqueCtrl', function($scope, $route){
  $scope.idConseiller="all";

  $scope.resultats = [
    {id:0, idConseiller: 0, nom:"Jean", prenom:"Jean", date: new Date('2017/03/01'), duree: '20 min', note : 7},
    {id:1, idConseiller: 1, nom:"Jean", prenom:"Baptiste", date: new Date('2017/03/01'), duree: '17 min', note : 5},
    {id:2, idConseiller: 2, nom:"Jean", prenom:"Pierre", date: new Date('2017/03/02'), duree: '15 min', note : 2},
    {id:3, idConseiller: 0, nom:"Jean", prenom:"Jean", date: new Date('2017/03/08'), duree: '15 min', note : 2},
    {id:4, idConseiller: 2, nom:"Jean", prenom:"Pierre", date: new Date('2017/03/09'), duree: '15 min', note : 2},
  ]

  $scope.noteMin=0;
  $scope.noteMax=10;

  // Gestion des DatePicker

  $scope.clearDebut = function() {
    $scope.dateDebut = null;
  };

  $scope.clearFin = function() {
    $scope.dateDebut = null;
  };

  $scope.inlineOptions = {
    minDate: new Date(),
    showWeeks: true
  };


  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.format = 'dd/MM/yyyy';

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };
});

app.controller('gestionnaireCtrl',[ '$scope', '$location', '$http', 'userFactory', 'groupFactory', 'conseillerFactory', function($scope, $location, $http, userFactory, groupFactory, conseillerFactory){
    $scope.password="";
    $scope.passwordConfirm="";


    $scope.showError= function(){
        return ($scope.passwordConfirm != '' && $scope.passwordConfirm != $scope.password);
    }

    $scope.disableButton = function(){
        return $scope.formInscription.email.$valid == false || $scope.showError() == true || $scope.password == "" || $scope.passwordConfirm == "" || $scope.email == "" || $scope.nom == "" || $scope.prenom == "";
      }

    $scope.models = {
        selected: null,
        lists: {"Conseillers": [], "Conseillers restants": []}
    };

    // Generate initial model
    /*for (var i = 1; i <= 3; ++i) {
        $scope.models.lists.Groupe.push({label: "Conseiller " + i});
        $scope.models.lists.Conseiller.push({label: "Conseiller " + (i+4)});
    }*/

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    $scope.registerConseiller = function(){
      let user = {
        nom:$scope.nom,
        prenom:$scope.prenom,
        email:$scope.email,
        password:$scope.password,
        passwordConfirm:$scope.passwordConfirm,
      }

      userFactory.addUser(user).then(function(reponse){
        if(reponse.error !== undefined){
          $scope.error=reponse.error;
          $scope.resultat = '';
        }else {
          $scope.error='';
          $scope.resultat = reponse.result;
        }
      });
    }


      groupFactory.getGroups().then(function(reponse){

          console.log(reponse);
          $scope.groups = reponse;
        
      });

      $scope.showConseillersOfGroup = function(idgroup){
        conseillerFactory.getConseillersofGroup(idgroup).then(function(reponse){
          $scope.conseillers= reponse;
          $scope.models.lists.Conseillers.push(reponse);    
        });
      }



}])
