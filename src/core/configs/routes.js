(function () {
  'use strict';
  angular.module('Cmm.Configs').config(routesProvider);

  function routesProvider ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('test', {
      url: '/test',
      templateUrl: '/templates/test.html',
      controller: 'testController',
      controllerAs: 'testCtrl',
      params: {
        referer: null
      },
      // resolve: {
      //   loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
      //     return $ocLazyLoad.load(['core/controllers/testController.js']);
      //   }]
      // }
    });
        //  $urlRouterProvider.hashPrefix('');
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('test');
  }
})();
