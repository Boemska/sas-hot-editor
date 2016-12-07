angular.module('sasHotEditor', [
  'ngRoute',
  'ngMaterial',
  'picardy.fontawesome',
  'h54sDebugWindow',
  'h54sLoginModal',
  'h54sNavbar',
  'ngmTour',
  'sasHotEditor.main',
])

.config([
  '$routeProvider',
  '$mdThemingProvider',
  function($routeProvider, $mdThemingProvider) {
    $routeProvider.otherwise({redirectTo: '/'});

    $mdThemingProvider.theme('green')
      .primaryPalette('green')
      .accentPalette('light-green');
  }
]);
