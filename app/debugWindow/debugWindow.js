angular.module('h54sDebugWindow', ['sasAdapter'])

.controller('debugWindowCtrl', [
  '$scope',
  'sasAdapter',
  '$rootScope',
  '$sce',
  '$document',
  function($scope, sasAdapter, $rootScope, $sce, $document) {

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

    function handleKeyUp(e) {
      if(e.keyCode === 27) {
        $rootScope.showDebugWindow = false;
        $scope.$apply();
      }
    }

    $rootScope.$watch('showDebugWindow', function() {
      if($rootScope.showDebugWindow) {
        $document.bind('keyup', handleKeyUp);
      } else {
        $document.unbind('keyup', handleKeyUp);
      }
    });

  }
]);
