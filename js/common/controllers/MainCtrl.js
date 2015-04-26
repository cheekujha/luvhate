(function(window, angular){
	angular.module('common').controller('mainCtrl', mainCtrl);

	mainCtrl.$inject = ['$scope'];

	function mainCtrl($scope){
		var vm = this;
		function init(){
			initMethods();
		}

		function initMethods(){
			vm.fbLoginStatus = fbLoginStatus;
			vm.fbLogin = fbLogin;
			vm.fbLogout = fbLogout;
		}

		init();

		function fbLoginStatus(){
			facebookConnectPlugin.getLoginStatus(function(response){
				alert(response);
			}, function(err){
				alert("Error")
			});
		}

		function fbLogin(){
			var fbLoginSuccess = function (userData) {
		    alert("UserInfo: " + JSON.stringify(userData));
			}

			facebookConnectPlugin.login(["public_profile"],
		    fbLoginSuccess,
		    function (error) { alert("" + error) }
			);
		}

		function fbLogout(){
			facebookConnectPlugin.logout(function(response){
				alert(response);
			}, function(){
				alert('Error');
			});
		}
	}
}(window, angular));