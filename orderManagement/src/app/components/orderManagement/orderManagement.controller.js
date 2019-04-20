/**
 * Order Management Portal
 * by Nikhil(Martian)
 */

 (function () {
  'use strict';

  angular
    .module('orderManagementPortal')
    .controller('orderManagementController', orderManagementController);

  /** @ngInject */
  function orderManagementController($scope, $rootScope, $state, orderManagementService, $uibModal, toastr, $filter, $log) {

    var vm = this;
    vm.modal = {};
    vm.getOrderDetails= _getOrderDetails;
    vm.setDeleteIndex = _setDeleteIndex;

    activate();

    function activate() {
      // Force redirect to Login/order Details (safety precaution for routing miss behavior)
      ($rootScope.loginStatus)?_getOrderDetails():$state.go('home.login');      
    }


    /////////////////////////////////////////////////////////////////////////
    /// implementation
    /// all internal functions shall be prefixed with '_' for differentiating
    ///

   // fetching all Orders
    function _getOrderDetails() {
      return orderManagementService.getOrderDetails().then(function (response) {
          if (response.statusCode == 100) {
            toastr.error('Error \'' + response.statusMsg + '\' while loading data.', 'Opppss...', {
              closeButton: true,
              timeOut: 10000,
              progressBar: false,
              allowHtml: true
            });
          }
          vm.orderDetails = response.data;
          return vm.orderDetails;
        })
        .catch(function (error) {
          if (error.status != 404 && error.status != 500 && error.status != -1) {
            if (error.status === undefined) {
              toastr.error('Please reload the page. Or you may log-in into another tab.', 'Session expired!', {
                closeButton: true,
                timeOut: 10000,
                progressBar: false,
                allowHtml: true
              });
            } else {
              toastr.error('Error ' + error.status + ' while loading data.', 'Opppss...', {
                closeButton: true,
                timeOut: 10000,
                progressBar: false,
                allowHtml: true
              });
            }
          }
        });
    }

    function _setDeleteIndex(index){
      vm.deleteIndex = index;
    }    


    vm.editOrderDetails = function (app, index) {
      $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'editOrderDetails.html',
        windowClass: 'show',
        backdropClass: 'show',
        windowTopClass: 'hello',
        animation: true,
        controller: function ($scope, $uibModalInstance) {
           $scope.validateOrderNumber = function(numberPassed){
            $scope.foundOrderNumber = -1;
            for(var i=0; i<vm.orderDetails.length; i++){
              if(numberPassed == vm.orderDetails[i].orderNumber ){
                $scope.foundOrderNumber = i;
                break;
              }
            }
          }
          if(app != "New"){
             $scope.newOrder = angular.copy(app) ;
             $scope.newOrder.orderDueDate = new Date($scope.newOrder.orderDueDate.replace(/-/g, ", "));
             $scope.editIndex = index;
             $scope.validateOrderNumber($scope.newOrder.orderNumber);
          }else{
            $scope.newOrder= {orderDueDate : new Date().toISOString().split('T')[0]}; 
            $scope.newOrder.orderDueDate = new Date($scope.newOrder.orderDueDate);
            $scope.editIndex = -2;
          }
          $scope.orderDetailModalcancel = function () {
            var variable = {
              "orderNumber": '',
              "orderDueDate": '',
              "buyerName":'',
              "customerAddress":'',
              "customerPhone":'',
              "orderTotal":''
            };
            $scope.newOrder = angular.copy(variable);
            $scope.orderDetailsPopup.$setPristine();
            $scope.orderDetailsPopup.$setUntouched();
            $scope.editIndex= -2;
            $uibModalInstance.dismiss('cancel');
          };

          $scope.timeStampValidation = function (selectedTime){
            var selectedTime= new Date(selectedTime.getFullYear(), selectedTime.getMonth(), selectedTime.getDate());
            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            if(selectedTime.getTime()<today.getTime()){
              $scope.invalidTimeStamp = true;
            }else{
              $scope.invalidTimeStamp = false;
            }
          }

         

          $scope.submitDetails = function(details){
            $scope.validateOrderNumber(details.orderNumber);
            var selectedDate =details.orderDueDate.getFullYear() + "-" + (details.orderDueDate.getMonth() +1)+ "-"+ details.orderDueDate.getDate() ;
            console.log("selectedDate",selectedDate);
            details.orderDueDate = selectedDate;
            ( $scope.editIndex !=-2 )?vm.orderDetails[$scope.editIndex] = details:vm.orderDetails.push(details);
            $scope.orderDetailModalcancel();
          }
        },
        controllerAs: 'orderDetailsPopup',
        size: 'lg'
      })
    }

     vm.deleteOrderModal = function () {
      $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'deleteOrder.html',
        windowClass: 'show',
        backdropClass: 'show',
        windowTopClass: 'hello',
        animation: true,
        controller: function ($scope, $uibModalInstance) {
         
          $scope.deleteOrderCancel = function () {
            $uibModalInstance.dismiss('cancel');
          };


          $scope.deleteOrder = function(details){
            vm.orderDetails.splice(vm.deleteIndex, 1);
            $scope.deleteOrderCancel();
          }
        },
        controllerAs: 'deleteOrderModal',
        size: 'lg'
      })
    }
  }

})();
