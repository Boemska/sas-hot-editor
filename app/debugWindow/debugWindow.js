angular.module('h54sDebugWindow', ['sasAdapter'])

.controller('debugWindowCtrl', ['$scope', 'sasAdapter', '$rootScope', '$sce', function($scope, sasAdapter, $rootScope, $sce) {

  $rootScope.$watch('showDebugWindow', function() {
    if($rootScope.showDebugWindow) {
      $scope.appLogs = sasAdapter.getApplicationLogs();
      $scope.debugData = sasAdapter.getDebugData().map(function(el) {
        return {
          time: el.time,
          message: $sce.trustAsHtml(el.debugHtml.replace(/<style.+>(.|\n)+<\/style>/g, '').replace(/<link.+>/g, '')),
          sasProgram: el.sasProgram
        };
      });
      $scope.sasErrors = sasAdapter.getSasErrors();
      $scope.failedRequests = sasAdapter.getFailedRequests().map(function(el) {
        return {
          time: el.time,
          message: $sce.trustAsHtml(el.responseHtml.replace(/<style.+>(.|\n)+<\/style>/g, '').replace(/<link.+>/g, '')),
          sasProgram: el.sasProgram
        };
      });

      var headerHeight = $('#debugWindow .nav.nav-tabs').height();
      var height = $('#debugWindow').height() - headerHeight - 10;
      $('#debugWindow .tab-content').height(height);
    }
  });

  $scope.closeDebugWindow = function() {
    $rootScope.showDebugWindow = false;
  };

  $scope.clearSasErrors = function() {
    sasAdapter.clearSasErrors();
    $scope.sasErrors = [];
  };

  $scope.clearDebugData = function() {
    sasAdapter.clearDebugData();
    $scope.debugData = [];
  };

  $scope.clearApplicationLogs = function() {
    sasAdapter.clearApplicationLogs();
    $scope.appLogs = [];
  };

  $scope.clearFailedRequests = function() {
    sasAdapter.clearFailedRequests();
    $scope.failedRequests = [];
  };

}]);
