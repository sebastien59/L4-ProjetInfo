'use strict';

app.controller('adminCtrl', function($scope, $location, userFactory){
    $scope.user={}
    $scope.user.password != '';
    $scope.user.passwordConfirm != '';

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

    userFactory.get().then(function(reponse){
      $scope.user = reponse;
      $scope.user.password = '';
      $scope.user.passwordConfirm = '';
    });

    $scope.updateUser = function(){
      userFactory.update($scope.user).then(function(result){
        $scope.message=(result.result == 1)? "Votre a bien été modifié !" : "Une erreur s'est produite!";
      })
    }

    $scope.showError= function(){
        return ($scope.user.passwordConfirm != '' && $scope.user.passwordConfirm != $scope.user.password);
    }


})

app.controller('historiqueCtrl', function($scope, $route, historiqueFactory, conseillerFactory){
  $scope.idConseiller="all";

  /*$scope.resultats = [
    {id:0, idConseiller: 0, type:"audio", nom:"Jean", prenom:"Jean", date: new Date('2017/03/01'), duree: '20 min', note : 7},
    {id:1, idConseiller: 1, type:"texte", nom:"Jean", prenom:"Baptiste", date: new Date('2017/03/01'), duree: '17 min', note : 5},
    {id:2, idConseiller: 2, type:"audio", nom:"Jean", prenom:"Pierre", date: new Date('2017/03/02'), duree: '15 min', note : 2},
    {id:3, idConseiller: 0, type:"texte", nom:"Jean", prenom:"Jean", date: new Date('2017/03/08'), duree: '15 min', note : 2},
    {id:4, idConseiller: 2, type:"texte", nom:"Jean", prenom:"Pierre", date: new Date('2017/03/09'), duree: '15 min', note : 2},
  ]*/

  conseillerFactory.getConseillers().then(function(res){
    $scope.conseillers = res;
  });

  historiqueFactory.getHistorique().then(function(res){
    $scope.resultats = res;
  });

  $scope.noteMin=0;
  $scope.noteMax=10;
  $scope.type="";
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

      $scope.models = [
           {listName: "Conseillers du groupe", items: [], dragging: false},
           {listName: "Conseillers restants", items: [], dragging: false}
         ];

         /**
          * dnd-dragging determines what data gets serialized and send to the receiver
          * of the drop. While we usually just send a single object, we send the array
          * of all selected items here.
          */
         $scope.getSelectedItemsIncluding = function(list, item) {
           item.selected = true;
           return list.items.filter(function(item) { return item.selected; });
         };

         /**
          * We set the list into dragging state, meaning the items that are being
          * dragged are hidden. We also use the HTML5 API directly to set a custom
          * image, since otherwise only the one item that the user actually dragged
          * would be shown as drag image.
          */
         $scope.onDragstart = function(list, event) {
            list.dragging = true;
         };

         /**
          * In the dnd-drop callback, we now have to handle the data array that we
          * sent above. We handle the insertion into the list ourselves. By returning
          * true, the dnd-list directive won't do the insertion itself.
          */
         $scope.onDrop = function(listname, list, items, index) {
           angular.forEach(items, function(item) { item.selected = false; });
           list.items = list.items.slice(0, index)
                       .concat(items)
                       .concat(list.items.slice(index));

           if(listname == "Conseillers du groupe"){
              var idGroupe = $scope.selected_group;
           }else{
             idGroupe = null;
           }
           conseillerFactory.addConseillerGroupe(idGroupe);
           //requête ajax grâce à la factory conseiller et en utilisant idGroupe 
           return true;
         }

         /**
          * Last but not least, we have to remove the previously dragged items in the
          * dnd-moved callback.
          */
         $scope.onMoved = function(list) {
           list.items = list.items.filter(function(item) { return !item.selected; });
         };

         // Generate the initial model
        /* angular.forEach($scope.models, function(list) {
           for (var i = 1; i <= 4; ++i) {
               list.items.push({label: "Item " + list.listName + i});
           }
         });*/

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
        $scope.groups = reponse;
    });

    $scope.showConseillersOfGroup = function(idgroup){
      var i;
      conseillerFactory.getConseillersofGroup(idgroup).then(function(reponse){
        $scope.conseillers= reponse;
        $scope.models[0].items = [];
        for(i=0; i < reponse.length;i++){
          $scope.models[0].items.push(reponse[i]);
        }

      });
    }

    //$scope.showConseillersRestants = function(idgroup){
      var i;
      conseillerFactory.getConseillersRestants().then(function(reponse){
        $scope.conseillers= reponse;
        $scope.models[1].items = [];
        for(i=0; i < reponse.length;i++){
          $scope.models[1].items.push(reponse[i]);
        }

      });
    //}
    $scope.CreerGroupe = function(nomGroupe){
      groupFactory.create(nomGroupe).then(function(result){
        $scope.message=(result.result == 1)? true:false;
        $scope.groups = groupFactory.get();
      })
    }
}])
