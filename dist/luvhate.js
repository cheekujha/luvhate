(function(window, angular){
	angular.module('facebook',[]);
}(window, angular));
 // install   :   cordova -d plugin add /Users/your/path/here/phonegap-facebook-plugin --variable APP_ID="123456789" --variable APP_NAME="myApplication"
// link      :   https://github.com/Wizcorp/phonegap-facebook-plugin
(function(window, angular){
  angular.module('facebook').factory('facebookFactory', facebookFactory);

  facebookFactory.$inject = ['$q'];

  function facebookFactory($q){
    return{
      browserInit : browserInit,
      login : login,
      showDialog : showDialog,
      api : api,
      getAccessToken : getAccessToken,
      getLoginStatus : getLoginStatus,
      logout : logout
    }

    function browserInit(id, version) {
      this.appID = id;
      this.appVersion = version || "v2.0";
      facebookConnectPlugin.browserInit(this.appID, this.appVersion);
    };

    function login(permissions) {
      var q = $q.defer();
      facebookConnectPlugin.login(permissions, function (res) {
        q.resolve(res);
      }, function (res) {
        q.reject(res);
      });

      return q.promise;
    };

    function showDialog(options) {
      var q = $q.defer();
      facebookConnectPlugin.showDialog(options, function (res) {
        q.resolve(res);
      }, function (err) {
        q.reject(err);
      });
      return q.promise;
    }

    function api(path, permissions) {
      var q = $q.defer();
      facebookConnectPlugin.api(path, permissions, function (res) {
        q.resolve(res);
      }, function (err) {
        q.reject(err);
      });
      return q.promise;
    }

    function getAccessToken() {
      var q = $q.defer();
      facebookConnectPlugin.getAccessToken(function (res) {
        q.resolve(res);
      }, function (err) {
        q.reject(err);
      });
      return q.promise;
    }

    function getLoginStatus() {
      var q = $q.defer();
      facebookConnectPlugin.getLoginStatus(function (res) {
        q.resolve(res);
      }, function (err) {
        q.reject(err);
      });
      return q.promise;
    }

    function logout() {
      var q = $q.defer();
      facebookConnectPlugin.logout(function (res) {
        q.resolve(res);
      }, function (err) {
        q.reject(err);
      });
      return q.promise;
    }
  }
}(window, angular));

 (function(window, angular){
	angular.module('login',[]);
}(window, angular));
 (function(window, angular){
	angular.module('login').controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = ['$scope', 'facebookFactory', '$state'];

	function loginCtrl($scope, facebookFactory, $state){
		var vm = this;
		function init(){
			initMethods();
		}

		function initMethods(){
			vm.facebookLogin = facebookLogin;
		}

		init();

		function facebookLogin(){
			facebookFactory.login(['user_friends', 'public_profile', 'read_custom_friendlists']).then(loginSuccess, loginError);
		}

		function loginSuccess(response){
			$state.go('home.profile');
			console.log('facebookLogin success', response);

		}

		function loginError(response){
			console.log('facebookLogin error', response);
		}
	}
}(window, angular));
 (function(window, angular){
	angular.module('peopleSearch',[]);
}(window, angular));
 (function(window, angular){
	angular.module('peopleSearch').controller('peopleSearchCtrl', peopleSearchCtrl);

	peopleSearchCtrl.$inject = ['$scope', 'peopleSearchFactory', 'friendSearchFactory'];

	function peopleSearchCtrl($scope, peopleSearchFactory, friendSearchFactory){
		var vm = this;
		function init(){
			vm.peopleList = [];
			vm.showLoadMoreButton = false;
			vm.friendList = [];
			vm.friendListLoaded = false;
			initMethods();
		};

		function initMethods(){
			vm.searhclicked = searhclicked;
			vm.loadMoreClicked = loadMoreClicked;
			vm.getFriendList = getFriendList;
			vm.loadMoreFriendClicked = loadMoreFriendClicked;
		};
		init();

		function searhclicked(searchText){
			if(searchText && searchText.trim().length > 0){
				peopleSearchFactory.search(searchText,'user').then(function(list){
					peopleSearchSuccess(list, true);
				}, peopleSearchError);
			}
		};

		function peopleSearchSuccess(list, emptyList){
			console.log("searchSuccess",list);
			if(list.length > 0){
				vm.showLoadMoreButton = true;
			}else{
				vm.showLoadMoreButton = false;
			}
			if(emptyList){
				vm.peopleList = [];
				vm.peopleList.length = 0;
			}
			var oldList = vm.peopleList;
			var newList = oldList.concat(list);
			vm.peopleList = newList;
		};

		function peopleSearchError(){
			console.error("searchError");
		};

		function loadMoreClicked(){
			peopleSearchFactory.nextSearch().then(function(list){
					peopleSearchSuccess(list, false);
				}, peopleSearchError);
		};

		function getFriendList(){
			if(!vm.friendListLoaded){
				friendSearchFactory.search().then(friendSearchSuccess, friendSearchError);	
			}		
		};

		function friendSearchSuccess(list){
			if(list.length > 0){
				vm.showFriendLoadMoreButton = true;
			}else{
				vm.showFriendLoadMoreButton = false;
			}
			var oldList = vm.friendList;
			var newList = oldList.concat(list);
			vm.friendList = newList;
			vm.friendListLoaded = true;
		};

		function friendSearchError(response){
			console.log("friendSearchError",response);
		};

		function loadMoreFriendClicked(){
			friendSearchFactory.nextSearch().then(friendSearchSuccess, friendSearchError);
		}
	}
}(window, angular));

 (function(window, angular){
	angular.module('peopleSearch').factory('friendSearchFactory', friendSearchFactory);

	friendSearchFactory.$inject = ['facebookFactory', '$q'];

	function friendSearchFactory(facebookFactory, $q){
		var friendList = [],
				nextSearchPath = null;
		return{
			search : search,
			nextSearch : nextSearch
		}

		function search(){
			var defer = $q.defer();
      // var path = '/search?q='+query+'&type='+type;
      var path = '/me/friends?debug=all';
      nextSearchPath = null;
      friendList = [];
      facebookFactory.api(path,['user_friends']).then(function(response){
      	if(response){
	      	setFriendList(response.data);
	      	setPaginationValues(response.data, response.paging);
      	}
      	defer.resolve(friendList);
      }, function(response){
      	defer.reject();
      });
      return defer.promise;
    }

    function setFriendList(list){
    	if(list && list.length > 0){
    		friendList = friendList.concat(list);
    	}
    }

    function setPaginationValues(list, pagingData){
    	if(list.length > 0 && pagingData){
    		nextSearchPath = formatNextPath(pagingData.next);
    	}else{
    		nextSearchPath = null;
    	}
    }

    function nextSearch(){
    	var defer = $q.defer();
    	if(nextSearchPath){
    		facebookFactory.api('me/'+nextSearchPath,['user_friends']).then(function(response){
	      	if(response){
		      	setFriendList(response.data);
		      	setPaginationValues(response.data, response.paging);
	      	}
	      	defer.resolve(response.data);
	      }, function(response){
	      	defer.reject(response);
	      });
    	}else{
    		defer.resolve([]);
    	}
    	return defer.promise;
    }

    function formatNextPath(path){
    	if(path){
    		var indexOfSearch = path.indexOf('friends');
    		if(indexOfSearch >= 0){
    			return path.substring(indexOfSearch);
    		}else{
    			return null;
    		}
    	}
    	return null;
    }
	}
}(window, angular));
 (function(window, angular){
	angular.module('peopleSearch').factory('peopleSearchFactory', peopleSearchFactory);

	peopleSearchFactory.$inject = ['facebookFactory', '$q'];

	function peopleSearchFactory(facebookFactory, $q){
		var peopleList = [],
				nextSearchPath = null,
				searchText = null;
		return{
			search : search,
			nextSearch : nextSearch
		}

		function search(query, type){
			var defer = $q.defer();
      var path = '/search?q='+query+'&type='+type;
      // var path = '/me/friends?debug=all';
      nextSearchPath = query;
      nextSearchPath = null;
      // peopleList = [];
      facebookFactory.api(path,[]).then(function(response){
      	if(response){
	      	setPeopleList(response.data, true);
	      	setPaginationValues(response.data, response.paging);
      	}
       // console.log('............................',peopleList.length);
      	defer.resolve(peopleList);
      }, function(response){
      	defer.reject();
      });
      return defer.promise;
    }

    function setPeopleList(list, emptyList){
    	if(emptyList){
    		peopleList = [];
        peopleList.length = 0;
    	}
    	if(list && list.length > 0){
    		peopleList = peopleList.concat(list);
    	}
    }

    function setPaginationValues(list, pagingData){
    	if(list.length > 0 && pagingData){
    		nextSearchPath = formatNextPath(pagingData.next);
    	}else{
    		nextSearchPath = null;
    	}
    }

    function nextSearch(){
    	var defer = $q.defer();
    	if(nextSearchPath){
    		facebookFactory.api(nextSearchPath,[]).then(function(response){
	      	if(response){
		      	setPeopleList(response.data, false);
		      	setPaginationValues(response.data, response.paging);
	      	}
          //console.log('............................',response.data.length);
          //console.log('............................',peopleList.length);
	      	defer.resolve(response.data);
	      }, function(response){
	      	defer.reject(response);
	      });
    	}else{
    		defer.resolve([]);
    	}
    	return defer.promise;
    }

    function formatNextPath(path){
    	if(path){
    		var indexOfSearch = path.indexOf('search');
    		if(indexOfSearch >= 0){
    			return path.substring(indexOfSearch);
    		}else{
    			return null;
    		}
    	}
    	return null;
    }
	}
}(window, angular));

 (function(window, angular){
	angular.module('searchListItem',[]);
}(window, angular));
 (function(window, angular){
	angular.module('searchListItem').controller('searchListItemCtrl', searchListItemCtrl);

	searchListItemCtrl.$inject = ['$scope'];

	function searchListItemCtrl($scope){
		var vm = this;
		function init(){
			initMethods();
		}

		function initMethods(){

		}

		init();
	}
}(window, angular));
 (function(window, angular){
	angular.module('searchListItem').directive('searchListItem', searchListItem);

	searchListItem.$inject = [];

	function searchListItem(){
		return {
			restrict : 'E',
			scope : {
				profile : '=',
			},
			templateUrl : 'modules/search-list-item/partials/SearchListItem.html',
			controller : 'searchListItemCtrl',
			controllerAs : 'vm',
			link : function(scope, element, attrs, ctrl){
				ctrl.profile = scope.profile;
			}
		}
	}
}(window, angular));
 (function(window, angular){
	angular.module('userProfile',[]);
}(window, angular));
 (function(window, angular){
	angular.module('userProfile').controller('userProfileCtrl', userProfileCtrl);

	userProfileCtrl.$inject = ['$scope', 'facebookFactory', '$state'];

	function userProfileCtrl($scope, facebookFactory, $state){
		var vm = this;
		function init(){
			initMethods();
		}
		function initMethods(){
			vm.logoutClicked = logoutClicked;
		}

		init();

		function logoutClicked(){
			facebookFactory.logout().then( logoutSuccess, function(){alrt('logout error')});
		}

		function logoutSuccess(){
			$state.go('home.login');
		}

	}
}(window, angular));
 (function(window, angular){
	angular.module('common',[]);
}(window, angular));
 (function(window, angular){
	angular.module('common').constant('facebookEnums',facebookEnums());

	function facebookEnums(){
		return{
			status : {
				'connected' : 'connected',
				'notAuthorized' : 'not_anuthorized',
				'unknown' : 'unknown'
			}
		}
	}
}(window, angular));
 (function(window, angular){
	angular.module('common').controller('mainCtrl', mainCtrl);

	mainCtrl.$inject = ['$scope', '$timeout', 'facebookFactory', '$window', 'facebookEnums' , '$state'];

	function mainCtrl($scope, $timeout, facebookFactory, $window, facebookEnums, $state){
		var vm = this, authResponse;
		function init(){
			initMethods();
			initListeners();
		}

		function initMethods(){
			vm.fbLoginStatus = fbLoginStatus;
			vm.fbLogin = fbLogin;
			vm.fbLogout = fbLogout;
			vm.search = search;
		}

		function initListeners(){
			document.addEventListener('deviceready', onDeviceReady, false);
		}
		init();

		function startApp(){
			facebookFactory.browserInit('584636644972667');
			checkLoginStatus();
		}

		function checkLoginStatus(){
			facebookFactory.getLoginStatus().then(loginStatusSuccess, loginStatusError)
		}

		function loginStatusSuccess(response){
			// if(response.status === )
			alert('>>>>>>>>>loginStatusSuccess>>>>>>>>>>>>>>>>>>',response);
			if(response.status === facebookEnums.status.connected){
				// alert('connected');
				$state.go('.profile');
			}else{
				$state.go('.login');
			}
		}

		function loginStatusError(response){
			console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>',response);
		}

		function onDeviceReady(){
			alert("device ready");
			startApp();
		}

		function search(){
			alert('MAKING REQUEST');
			facebookConnectPlugin.api('/search?q=rupal khare&type=user', [], searchSuccess, searchError);	
		}

		function searchSuccess(data){
			alert('IN SUCCESS');
			setMessageFromFacebook(data);
		}

		function searchError(data){
			alert('IN ERROR');
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
 (function(window, angular){
	window.APPNAME = "luvhate";
	angular.module(window.APPNAME,[
		'luvhate.templates',
		'mobile-angular-ui',
		'ui.router',
		'common',
		'facebook',
		'login',
		'userProfile',
		'peopleSearch',
		'searchListItem'
	]);

	angular.module(window.APPNAME).config(function($stateProvider, $urlRouterProvider) {
	  //
	  // For any unmatched url, redirect to /state1
	  $urlRouterProvider.otherwise("/home");
	  //
	  // Now set up the states
	  $stateProvider
	  	.state('home', {
	  		url : '/home',
	  		template : '<div ui-view class="router-view"></div>',
	  		controller : 'mainCtrl',
	  		controllerAs : 'vm'
	  	})
	    .state('home.login', {
	      templateUrl: 'modules/login/partials/Login.html',
	      controller : 'loginCtrl',
	      controllerAs : 'vm'
	    })
	    .state('home.profile', {
	    	url : '/profile',
	    	templateUrl : 'modules/user-profile/partials/UserProfile.html',
	    	controller : 'userProfileCtrl',
	    	controllerAs : 'vm'
	    })
	    .state('home.search', {
	    	templateUrl : 'modules/people-search/partials/PeopleSearch.html',
	    	url : '/search',
	    	controller : 'peopleSearchCtrl',
	    	controllerAs : 'vm'
	    });
	});
}(window, angular));