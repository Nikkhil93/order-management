/**
 * Order Management Portal
 * by Nikhil(Martian)
 */

 (function () {
  "use strict";

  angular.module("orderManagementPortal").config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider

      .state("home", {
        templateUrl: "app/components/home/home.html",
        controller: "homeController",
        controllerAs: "home",
        resolve: {
          deps: [
            "$ocLazyLoad",
            "cfpLoadingBar",
            function ($ocLazyLoad, cfpLoadingBar) {
              cfpLoadingBar.start();
              return $ocLazyLoad.load(["HomeModule"]).then(function () {
                cfpLoadingBar.complete();
              });
            }
          ]
        }
      })

      .state("home.login", {
        url: '/login',
        templateUrl: "app/components/login/login.html",
        controller: "loginController",
        controllerAs: "login",
        data: {
          title: 'Login | Order Management'
        },
        resolve: {
          deps: [
            "$ocLazyLoad",
            "cfpLoadingBar",
            function ($ocLazyLoad, cfpLoadingBar) {
              cfpLoadingBar.start();
              return $ocLazyLoad.load(["LoginModule"]).then(function () {
                cfpLoadingBar.complete();
              });
            }
          ]
        }
      })


      .state('home.orderManagement', {
        url: '/orderDetails',
        templateUrl: 'app/components/orderManagement/orderManagement.html',
        controller: 'orderManagementController',
        controllerAs: 'orderManagement',
        resolve: {
          deps: ['$ocLazyLoad', 'cfpLoadingBar', function ($ocLazyLoad, cfpLoadingBar) {
            cfpLoadingBar.start();
            return $ocLazyLoad.load([
              'orderManagementModule'
            ]).then(function () {
              cfpLoadingBar.complete();
            });
          }]
        }
      })
      .state('home.orderManagement.orderDetails', {
        templateUrl: 'app/components/orderManagement/orderManagementOrderdetails.html',
        data: {
          title: 'Orders | Order Management'
        }
      });

    $urlRouterProvider.otherwise("/login");
  }
})();
