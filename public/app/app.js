'use strict';

var app = angular.module('ServiceClient', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/conseiller', {
    templateUrl: '/views/compte.html'
  })
  .when('/conseiller/resultat', {
    templateUrl: '/views/resultat.html'
  })
  .when('/conseiller/chat/:id', {
    templateUrl: '/views/chat.html',
    controller: 'chatCtrl'

  })
  .otherwise({
      redirectTo: '/conseiller'
    });
});
