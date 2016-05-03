angular.module('myApp.view1', ['ngRoute', 'dynamicHandsontable'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'sasAdapter', '$rootScope', function ($scope, sasAdapter, $rootScope) {
  sasAdapter.call('/Apps/tableEditor/getTable').then(function(res) {
    $scope.htDynamicSpec = res.columnspec;
    $scope.htData = res.tabledata;
  }, function(err) {
    //error
  });
}]);
