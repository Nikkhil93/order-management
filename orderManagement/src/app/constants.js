/**
 * Order Management Portal
 * by Nikhil(Martian)
 */

 (function () {
  'use strict';

  angular
    .module('orderManagementPortal')
    .constant('constants', {
    
    //API endpoint for localhost
    apiHost: 'http://'+window.location.hostname+':3000/orderManagement/'

    });
})();
