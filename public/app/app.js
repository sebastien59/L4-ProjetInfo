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
