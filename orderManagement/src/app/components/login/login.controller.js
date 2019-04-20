/**
 * Order Management Portal
 * by Nikhil(Martian)
 */

 (function(){
	'use strict';
	angular
		.module('orderManagementPortal')
		.controller('loginController', loginController);
	/** @ngInject */
	function loginController($rootScope, $state){
		var vm = this;
		vm.submitLoginDetails = _submitLoginDetails;
		vm.username = null;
		vm.password =null;

		activate();
		function activate(){
			if(sessionStorage.getItem("username")){
				$rootScope.loginStatus= true;
				$rootScope.userName = sessionStorage.getItem("username");
			}
			if($rootScope.loginStatus){
				$state.go('home.orderManagement.orderDetails');
			}
		}


    /////////////////////////////////////////////////////////////////////////
    /// implementation
    /// all internal functions shall be prefixed with '_' for differentiating

		function _submitLoginDetails(){
			if(vm.username ==="Martian" && vm.password ==="Pass@123" ){
				$rootScope.loginStatus = true;
				$rootScope.userName= vm.username;
				if (typeof(Storage) !== "undefined") {
  				sessionStorage.setItem("username", vm.username);
  				var usernameSession= sessionStorage.getItem("username");
				}
				$state.go('home.orderManagement.orderDetails');
			}else {
				vm.displayData = "Wrong User Name or Password!!";
			}
		}
	}
})();