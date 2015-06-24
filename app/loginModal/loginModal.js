angular.module('h54sLoginModal', ['sasAdapter'])

.controller('LoginModalCtrl', ['$scope', 'sasAdapter', function($scope, sasAdapter) {

  $scope.handleLogin = function() {
    var user = $scope.user;
    var pass = $scope.pass;

    $('#login-form').validator('validate');

    try {
      sasAdapter.login(user, pass).then(function(status) {
        if(status === -1) {
          $('#login-msg').text('Wrong credentials');
        } else if(status === 200) {
          $('#login-modal').modal('hide');
        } else {
          $('#login-msg').text('Failed request. Please try again later.');
        }
      });
    } catch(e) {
      //errors thrown by adapter
      //e.g. when user or pass is empty
      console.error(e.message);
    }
  };

  $scope.handleKeypress = function($event) {
    if($event.keyCode === 13) {
      $scope.handleLogin();
    }
  }
}]);
