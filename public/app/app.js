'use strict';

var app = angular.module('ServiceClient', ['ngRoute', 'ngAnimate', 'ngTouch', 'ui.bootstrap', 'dndLists']);

app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/conseiller', {
    templateUrl: '/views/compte.html'
  })
  .when('/conseiller/resultat', {
    templateUrl: '/views/resultat.html',
    controller: 'resultatCtrl'
  })
  .when('/conseiller/chat/:id', {
    templateUrl: '/views/chat.html',
    controller: 'chatCtrl'
  })
  .when('/admin', {
    templateUrl: '/views/compte.html',
  })
  .when('/admin/gestionnaire', {
    templateUrl: '/views/admin/gestionnaire.html',
    controller: 'gestionnaireCtrl'
  })
    .when('/admin/resultat', {
    templateUrl: '/views/resultat.html',
    controller: 'resultatCtrl'
  })
  .when('/logout', {
    template:'',
     controller: 'logoutctrl'
  })
  .otherwise({
      redirectTo: '/error'
    });
});

app.controller('logoutctrl', function($scope, $location, $window){
  $window.location.href = '/logout';
})
