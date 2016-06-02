angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'picardy.fontawesome',
  'h54sDebugWindow',
  'h54sLoginModal',
  'h54sNavbar',
  'flow',
  'myApp.main',
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
