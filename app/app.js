angular.module('myApp', [
  'ngRoute',
  'h54sDebugWindow',
  'h54sLoginModal',
  'h54sNavbar',
  'myApp.view1',
  'myApp.view2'
])

.config(['$routeProvider', 'ngToastProvider', function($routeProvider, ngToastProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});

  ngToastProvider.configure({
    animation: 'fade', // or 'slide',
    dismissButton: true,
    additionalClasses: 'shadow-toast',
    timeout: 180000 //3 minutes - it's manually dismissed
  });
}]);
