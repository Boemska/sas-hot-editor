angular.module('myApp.main', ['ngRoute', 'dynamicHandsontable'])

.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'main/mainPage.html',
      controller: 'MainCtrl'
    });
  }
])

.controller('SideCtrl', [
  '$scope',
  function($scope) {

  }
])

.controller('MainCtrl', [
  '$scope',
  'sasAdapter',
  '$rootScope',
  '$mdToast',
  function ($scope, sasAdapter, $rootScope, $mdToast) {
    var toast = $mdToast.build({
      hideDelay: 1800,
      position: 'bottom right'
    });

    $scope.onHandsontableError = function(msg) {
      toast.template('<md-toast class="error"><div>' + msg +'</div></md-toast>');
      $mdToast.show(toast);
    };

    var table = sasAdapter.createTable([
      {libname: "TESTDATA", memname: "CLASS"}
    ], 'data');

    sasAdapter.call('/Apps/tableEditor/getTable', table).then(function(res) {
      $scope.htDynamicSpec = res.columnspec;
      $scope.htData = res.tabledata;
    }, function(err) {
      alert(err);
    });

    $scope.save = function() {
      table.add($scope.htData, 'tabledata');
      sasAdapter.call('/Apps/tableEditor/writeTable', table).then(function(res) {
        $scope.htDynamicSpec = res.columnspec;
        $scope.htData = res.tabledata;
      }, function(err) {
        alert(err);
      });
    };
  }
]);
