angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [
  '$scope',
  'sasAdapter',
  '$rootScope',
  function ($scope, sasAdapter, $rootScope) {
/*
    sasAdapter.call('programPath').then(function(res) {
      //success
    }, function(err) {
      //error
    });
*/
  }
]);
