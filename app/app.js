angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'picardy.fontawesome',
  'h54sDebugWindow',
  'h54sLoginModal',
  'h54sNavbar',
  'myApp.view1',
  'myApp.view2'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
