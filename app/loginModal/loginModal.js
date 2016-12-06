angular.module('h54sLoginModal', ['sasAdapter', 'ngMaterial'])

.controller('LoginModalCtrl', [
  '$scope',
  'sasAdapter',
  '$mdDialog',
  function($scope, sasAdapter, $mdDialog) {
    $scope.handleLogin = function() {
      //disable submit button based on loading property
      $scope.loading = true;

      var user = $scope.user;
      var pass = $scope.pass;

      $scope.error = false;

      sasAdapter.login(user, pass).then(function(status) {
        if(status === -1) {
          $scope.msg = 'Wrong credentials';
          $scope.error = true;
        } else if(status === 200) {
          $scope.error = false;
          $mdDialog.hide();
        } else {
          $scope.msg = 'Failed request. Please try again later.';
          $scope.error = true;
        }

        $scope.loading = false;
      }, function(e) {
        $scope.msg = e.message;
        $scope.error = true;
        $scope.loading = false;
      });
    };

    $scope.handleKeypress = function($event) {
      if($event.keyCode === 13 && !$scope.loading) {
        $scope.handleLogin();
      }
    };

    $scope.$watch('user', function() {
      $scope.msg = '';
      $scope.error = false;
    });
    $scope.$watch('pass', function() {
      $scope.msg = '';
      $scope.error = false;
    });
  }
]);
