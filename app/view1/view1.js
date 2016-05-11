angular.module('myApp.view1', ['ngRoute', 'dynamicHandsontable'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'sasAdapter', '$rootScope', function ($scope, sasAdapter, $rootScope) {
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
