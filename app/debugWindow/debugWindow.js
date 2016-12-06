angular.module('h54sDebugWindow', ['sasAdapter'])

.controller('debugWindowCtrl', [
  '$scope',
  'sasAdapter',
  '$rootScope',
  '$sce',
  function($scope, sasAdapter, $rootScope, $sce) {
    $scope.appLogs = sasAdapter.getApplicationLogs();
    $scope.sasErrors = sasAdapter.getSasErrors();

    $scope.$watch(function() {
      return sasAdapter.getDebugData();
    }, function(debugData) {
      $scope.debugData = debugData.map(function(el) {
        return {
          time: el.time,
          message: $sce.trustAsHtml(el.debugHtml.replace(/<style.+>(.|\n)+<\/style>/g, '').replace(/<link.+>/g, '')),
          sasProgram: el.sasProgram
        };
      });
    }, true);

    $scope.$watch(function() {
      return sasAdapter.getFailedRequests();
    }, function(failedRequests) {
      $scope.failedRequests = failedRequests.map(function(el) {
        return {
          time: el.time,
          message: $sce.trustAsHtml(el.responseHtml.replace(/<style.+>(.|\n)+<\/style>/g, '').replace(/<link.+>/g, '')),
          sasProgram: el.sasProgram
        };
      });
    }, true);

    var headerHeight = $('#debugWindow .nav.nav-tabs').height();
    var height = $('#debugWindow').height() - headerHeight - 20;
    $('#debugWindow .tab-content').height(height);

    $scope.closeDebugWindow = function() {
      $rootScope.showDebugWindow = false;
    };

    $scope.clearSasErrors = function() {
      sasAdapter.clearSasErrors();
    };

    $scope.clearDebugData = function() {
      sasAdapter.clearDebugData();
    };

    $scope.clearApplicationLogs = function() {
      sasAdapter.clearApplicationLogs();
    };

    $scope.clearFailedRequests = function() {
      sasAdapter.clearFailedRequests();
    };
  }
]);
