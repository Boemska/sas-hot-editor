angular.module('h54sDebugWindow', ['sasAdapter'])

.controller('debugWindowCtrl', ['$scope', 'sasAdapter', '$rootScope', '$sce', function($scope, sasAdapter, $rootScope, $sce) {

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

  $scope.closeDebugWindow = function() {
    $rootScope.showDebugWindow = false;
  };

  $scope.clearSasErrors = function() {
    sasAdapter.clearSasErrors();
  };

  $scope.clearDebugData = function() {
    sasAdapter.clearDebugData();
    $scope.debugData.length = 0;
  };

  $scope.clearApplicationLogs = function() {
    sasAdapter.clearApplicationLogs();
  };

  $scope.clearFailedRequests = function() {
    sasAdapter.clearFailedRequests();
    $scope.failedRequests.length = 0;
  };

}]);
