/**
 * Order Management Portal
 * by Nikhil(Martian)
 */

 (function () {
  'use strict';

  angular
    .module('orderManagementPortal')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $document) {
    $rootScope.userName = "User";
    $rootScope.loginStatus = false;
    $rootScope.copyright_year = new Date().getFullYear();
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if (toState.data && toState.data.title) {
        $rootScope.title = toState.data.title;
      }
    });
  }
})();
