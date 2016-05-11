angular.module('myApp.main', ['ngRoute', 'dynamicHandsontable'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'main/mainPage.html',
    controller: 'MainCtrl'
  });
}])

.controller('SideCtrl', [
  '$scope',
  function($scope) {
    
  }
])

.controller('MainCtrl', ['$scope', 'sasAdapter', '$rootScope', function ($scope, sasAdapter, $rootScope) {
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
}]);
