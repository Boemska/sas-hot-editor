angular.module('alerts', [])

.controller('AlertsCtrl', [
  '$scope',
  'alerts',
  function($scope, alerts) {
    $scope.alerts = alerts.alerts;

    $scope.removeAlert = function(ind) {
      alerts.remove(ind);
    };
  }
])

.factory('alerts', [
  '$sce',
  function($sce) {
    return {
      alerts: [],
      create: function(message, type) {
        this.alerts.push({
          message: message,
          type: type
        });
      },
      remove: function(ind) {
        this.alerts.splice(ind, 1);
      }
    };
  }
]);
