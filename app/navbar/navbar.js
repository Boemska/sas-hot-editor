angular.module('h54sNavbar', ['sasAdapter', 'h54sDebugWindow'])

.controller('NavbarCtrl', ['$scope', 'sasAdapter', '$rootScope', '$sce', function($scope, sasAdapter, $rootScope, $sce) {
  $scope.openDebugWindow = function() {
    $rootScope.showDebugWindow = true;
  }

  $scope.toggleDebugging = function() {
    sasAdapter.toggleDebugMode();
  }

  if(sasAdapter.isDebugMode()) {
    $('#toggle-debug-btn').attr('aria-pressed', true).addClass('active');
  }

  sasAdapter.onRemoteConfigUpdate(function() {
    if(sasAdapter.isDebugMode()) {
      $('#toggle-debug-btn').attr('aria-pressed', true).addClass('active');
    }
  });
  
}]);
