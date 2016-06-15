angular.module('h54sNavbar', ['sasAdapter', 'h54sDebugWindow'])

.controller('NavbarCtrl', [
  '$scope',
  'sasAdapter',
  '$rootScope',
  '$sce',
  '$mdSidenav',
  'ngmTour',
  function($scope, sasAdapter, $rootScope, $sce, $mdSidenav, ngmTour) {
    $scope.openDebugWindow = function() {
      $rootScope.showDebugWindow = true;
    };

    $scope.toggleDebugging = function() {
      sasAdapter.toggleDebugMode();
    };

    $scope.debug = sasAdapter.isDebugMode();

    sasAdapter.onRemoteConfigUpdate(function() {
      $scope.$apply(function() {
        $scope.debug = sasAdapter.isDebugMode();
      });
    });

    $scope.openSideMenu = function() {
      $mdSidenav('left').toggle();
    };

    $scope.showTour = function() {
      ngmTour.start();
    };
  }
]);
