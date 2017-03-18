'use strict';

var app = angular.module('ServiceClient', ['ngRoute', 'ngAnimate', 'ngTouch', 'ui.bootstrap', 'dndLists']);

app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/conseiller', {
    templateUrl: '/views/conseiller/compte.html'
  })
  .when('/conseiller/historique', {
    templateUrl: '/views/conseiller/historique.html',
    controller: 'historiqueCtrl'
  })
  .when('/conseiller/chat/:id', {
    templateUrl: '/views/conseiller/chat.html',
    controller: 'chatCtrl'
  })
  .when('/admin', {
    templateUrl: '/views/admin/compte.html',
  })
  .when('/admin/gestionnaire', {
    templateUrl: '/views/admin/gestionnaire.html',
    controller: 'gestionnaireCtrl'
  })
    .when('/admin/historique', {
    templateUrl: '/views/admin/historique.html',
    controller: 'historiqueCtrl'
  })
  .when('/logout', {
    template:'',
    controller: 'logoutCtrl'
  })
  .otherwise({
    template:'',
    controller: 'errorCtrl'
    });
})

app.controller('logoutCtrl', function($scope, $location, $window){
  $window.location.href = '/logout';
})

app.controller('errorCtrl', function($scope, $location, $window){
  $window.location.href = '/error';
})


/* FILTRES */
app.filter('filterConseiller', function () {
  return function (items, idSelected) {
    var filtered = [];
    if(idSelected !== undefined && idSelected.indexOf("all") == -1){
      for (var i = 0; i < items.length; i++) {
        if(idSelected.indexOf(items[i].idConseiller.toString()) != -1){
          filtered.push(items[i]);
        }
      };
      return filtered;
    }
    return items;
  };
});

app.filter('filterDate', function () {
  return function (items, dateDebut, dateFin) {
    var filtered = [];

    if((dateDebut !== undefined && dateDebut != "") || (dateFin !== undefined && dateFin != "")){
      if(dateDebut !== undefined && dateDebut != ""){
        dateDebut.setHours(0);
        dateDebut.setMinutes(0);
        dateDebut.setSeconds(0);
        dateDebut.setMilliseconds(0);
      }else{
        dateDebut = new Date();
        dateDebut.setTime(0);
      }

      if(dateFin !== undefined && dateFin != ""){
        dateFin.setHours(0);
        dateFin.setMinutes(0);
        dateFin.setSeconds(0);
        dateFin.setMilliseconds(0);
      }else{
        dateFin = new Date();
      }

      for (var i = 0; i < items.length; i++) {
        if(items[i].date >= dateDebut && items[i].date <= dateFin){
          filtered.push(items[i]);
        }
      }
      return filtered;
    }
    return items;
  };
});

app.filter('filterNote', function () {
  return function (items, noteMin, noteMax) {
    var filtered = [];

    if(noteMin !== undefined || noteMax !== undefined){
      for (var i = 0; i < items.length; i++) {
        if(noteMin === undefined){
          noteMin = 0;
        }
        if(noteMax === undefined){
          noteMax=10
        }

        if(items[i].note >= noteMin && items[i].note <= noteMax){
          filtered.push(items[i]);
        }
      }
      return filtered;
    }
    return items;
  };
});
