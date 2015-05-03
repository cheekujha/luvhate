angular.module('luvhate.templates', ['modules/login/partials/Login.html', 'modules/people-search/partials/PeopleSearch.html', 'modules/search-list-item/partials/SearchListItem.html', 'modules/user-profile/partials/UserProfile.html']);

angular.module("modules/login/partials/Login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/login/partials/Login.html",
    "<div><div class=\"btn btn-block btn-social btn-facebook login-button\" ng-click=\"vm.facebookLogin()\"><i class=\"fa fa-facebook\"></i> Login With Facebook</div></div>");
}]);

angular.module("modules/people-search/partials/PeopleSearch.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/people-search/partials/PeopleSearch.html",
    "<ui-state default=\"1\" id=\"activeTab\"></ui-state><div ui-if=\"activeTab == 2\"><div class=\"people-list list-group scrollable\" ng-show=\"vm.friendList.length > 0\"><div class=\"scrollable-content\"><div class=\"section-header\">Friends</div><search-list-item profile=\"friend\" ng-repeat=\"friend in vm.friendList track by $index\"></search-list-item><div class=\"btn load-more-button\" ng-click=\"vm.loadMoreFriendClicked()\" ng-show=\"vm.showFriendLoadMoreButton\">Load More...</div></div></div><div class=\"no-friend-banner table\" ng-show=\"vm.friendList.length == 0 && vm.friendListLoaded\"><div class=\"table-cell middle-aligned text-center border-box padding-5\">No Friends Registered</div></div></div><div class=\"router-view\" ui-if=\"activeTab == 1\"><div class=\"input-group psoition-relative\"><input class=\"form-control search-input\" placeholder=\"Search people...\" ng-model=\"vm.searchText\"> <span class=\"input-group-btn\"><button class=\"btn btn-success search-button\" type=\"button\" ng-click=\"vm.searhclicked(vm.searchText)\">Go!</button></span></div><div class=\"people-list list-group scrollable\" ng-show=\"vm.peopleList.length > 0\"><div class=\"scrollable-content\"><div class=\"section-header\">Results</div><search-list-item profile=\"people\" ng-repeat=\"people in vm.peopleList track by $index\"></search-list-item><div class=\"btn load-more-button\" ng-click=\"vm.loadMoreClicked()\" ng-show=\"vm.showLoadMoreButton\">Load More...</div></div></div></div><div class=\"btn-group justified nav-tabs\"><a ui-set=\"{'activeTab': 1}\" ui-class=\"{'active': activeTab == 1}\" class=\"btn btn-default\">Search</a> <a ui-set=\"{'activeTab': 2}\" ui-class=\"{'active': activeTab == 2}\" class=\"btn btn-default\" ng-click=\"vm.getFriendList()\">Friends</a></div>");
}]);

angular.module("modules/search-list-item/partials/SearchListItem.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/search-list-item/partials/SearchListItem.html",
    "<div class=\"people-item list-group-item\"><img ng-src=\"https://graph.facebook.com/v2.0/{{profile.id}}/picture?redirect=true\" class=\"profile-image\"><div class=\"profile-name\"><div class=\"table\"><div class=\"table-cell middle-aligned\">{{profile.name}}{{profile.id}}</div></div></div><div class=\"choose top-aligned\"><div class=\"heart side left\"></div><div class=\"heart side right\"></div><div class=\"heart center\"></div></div></div>");
}]);

angular.module("modules/user-profile/partials/UserProfile.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/user-profile/partials/UserProfile.html",
    "<div class=\"router-view\"><button ng-click=\"vm.logoutClicked()\">Logout</button><div>User Profile</div><div class=\"spread-love-button btn\" ui-sref=\"home.search\">Spread Love</div></div>");
}]);
