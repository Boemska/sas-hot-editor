angular.module('alerts', [])

.controller('AlertsCtrl', function($scope, alerts) {
  $scope.alerts = alerts.alerts;

  $scope.removeAlert = function(ind) {
    alerts.remove(ind);
  };
})

.factory('alerts', function($sce) {
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
  }
})
