/**
 * Order Management Portal
 * by Nikhil(Martian)
 */

 (function () {
  'use strict';

  angular
    .module('orderManagementPortal')
    .controller('homeController', homeController);


  /** @ngInject */
  function homeController($log, $http, constants, $state, $rootScope, toastrConfig) {

    // Toastr configuration
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 8000;
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;

    var vm = this;
    vm.logout = _logout;

    activate();

    function activate() {
      // Force redirect to Login/order Details (safety precaution for routing miss behavior)
      
      ($rootScope.loginStatus)?$state.go('home.orderManagement.orderDetails'):$state.go('home.login');
    }

    /////////////////////////////////////////////////////////////////////////
    /// implementation
    /// all internal functions shall be prefixed with '_' for differentiating


    function _logout() {
      sessionStorage.clear();
      $rootScope.loginStatus = false;
      $rootScope.userName= "User";
      $state.go('home.login');
    }
  }

})();
