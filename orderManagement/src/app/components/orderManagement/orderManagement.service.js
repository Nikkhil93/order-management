/**
 * Order Management Portal
 * by Nikhil(Martian)
 */
(function() {
  'use strict';

  angular
    .module('orderManagementPortal')
    .factory('orderManagementService', orderManagementService);

  /** @ngInject */
  function orderManagementService($http, $q, constants) {

    var service = {
      getOrderDetails : _getOrderDetails
    };

    return service;

    /////////////////////////////////////////////////////////////////////////
    /// implementation
    /// all internal functions shall be prefixed with '_' for differentiating


    // get all Orders Using Api getAllOrderDetails
    function _getOrderDetails() {
         return $http.get(constants.apiHost + 'getAllOrderDetails')
        .then(getOrderDetailsComplete)
        .catch(getOrderDetailsFailed);

      function getOrderDetailsComplete(response) {
        return response.data;

      }

      function getOrderDetailsFailed(error) {
        //ignore... handlled in implemetation...
        return $q.reject(error);
      }
    }
   
  }
})();
