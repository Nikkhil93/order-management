/**
 * Order Management Portal
 * by Nikhil(Martian)
 */

 (function () {
  'use strict';

  angular
    .module('orderManagementPortal')

    .config(config);

  /** @ngInject */
  function config($provide, $logProvider, $ocLazyLoadProvider) {

    // Enable log
    $logProvider.debugEnabled(true);

    //ocLazyLoding config
    $ocLazyLoadProvider.config({
      modules: [
        // Home module
        {
          name: 'HomeModule',
          files: ['assets/css/app.css', 'assets/css/sass/appStyle.css', 'app/components/home/home.controller.js', 'app/externalModules/angular-toastr.tpls.min.js', 'assets/css/external/angular-toastr.min.css']
        },

        //login Module
        {
          name: 'LoginModule',
          files: ['app/components/login/login.controller.js']
        },
        // orderManagement Module
        {
            name: 'orderManagementModule',
            files: ['app/components/orderManagement/orderManagement.controller.js','app/components/orderManagement/orderManagement.service.js']
        }
      ]
    });

    $ocLazyLoadProvider.config({
      debug: false
    });
  }

})();
