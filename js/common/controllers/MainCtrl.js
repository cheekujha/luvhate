(function(window, angular){
	angular.module('common').controller('mainCtrl', mainCtrl);

	mainCtrl.$inject = ['$scope', '$timeout'];

	function mainCtrl($scope, $timeout){
		var vm = this, authResponse;
		function init(){
			initMethods();
		}

		function initMethods(){
			vm.fbLoginStatus = fbLoginStatus;
			vm.fbLogin = fbLogin;
			vm.fbLogout = fbLogout;
			vm.search = search;
		}

		init();

		function search(){
			facebookConnectPlugin.api('/search?q=rupal khare&type=user', searchSuccess, searchError);	
		}

		function searchSuccess(data){
			setMessageFromFacebook(data);
		}

		function searchError(data){
			setMessageFromFacebook(data);
		}

		function fbLoginStatus(){
			facebookConnectPlugin.getLoginStatus(function(response){
				// alert(response);
				alert(response.status);
			}, function(err){
				alert("Error")
			});
		}

		function fbLogin(){
			var fbLoginSuccess = function (userData) {
		    // alert("UserInfo: " + JSON.stringify(userData));
		    var data = JSON.stringify(userData);
		    authResponse = data.authResponse;
		    setMessageFromFacebook(userData)
			}

			facebookConnectPlugin.login(["public_profile"],
		    fbLoginSuccess,
		    function (error) { alert("" + error) }
			);
		}

		function fbLogout(){
			facebookConnectPlugin.logout(function(response){
				alert('loggedout '+response);
			}, function(){
				alert('Error');
			});
		}

		function setMessageFromFacebook(message){
			$timeout(function(){
				vm.messageFromFacebook = JSON.stringify(message);
			},0);
		}
	}
}(window, angular));