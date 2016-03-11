angular.module('sasAdapter', ['ngMaterial'])

.factory('sasAdapter', function($q, $rootScope, $timeout, $mdDialog, $mdMedia, $mdToast) {
  var _adapter = new h54s({
    isRemoteConfig: true
  });
  return {
    login: function(user, pass) {
      var deferred = $q.defer();
      try {
        _adapter.login(user, pass, function(status) {
          deferred.resolve(status);
        });
      } catch(e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    call: function(sasProgram, table) {
      var deferred = $q.defer();

      var toast = $mdToast.build({
        template: '<md-toast>Loading:&nbsp;<b>{{sasProgram}}</b></md-toast>',
        hideDelay: 1800,
        position: 'top right',
        controller: function($scope) {
          $scope.sasProgram = sasProgram;
        }
      });
      $mdToast.show(toast);

      _adapter.call(sasProgram, table, function(err, res) {

        if(err && (err.type === 'notLoggedinError' || err.type === 'loginError')) {
          $mdToast.hide();
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
          $mdDialog.show({
            controller: 'LoginModalCtrl',
            templateUrl: 'loginModal/loginModal.html',
            parent: angular.element(document.body),
            fullscreen: useFullScreen,
            escapeToClose: false
          });
          return;
        }

        if(err) {
          $timeout(function() {
            toast.template('<md-toast class="error">Error loading&nbsp;<b>{{sasProgram}}</b></md-toast>');
            $mdToast.show(toast);
          }, 800);

          if(err.type === 'programNotFound') {
            $mdDialog.show(
              $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Error loading ' + sasProgram)
                .textContent('You do not have the correct permissions for this function.')
                .ok('OK')
            );
          }

          deferred.reject(err);
        } else {
          toast.template('<md-toast class="success">Loaded:&nbsp;<b>{{sasProgram}}</b></md-toast>');
          $mdToast.show(toast);

          deferred.resolve(res);
        }
      });
      return deferred.promise;
    },
    createTable: function(table, macro) {
      return new h54s.Tables(table, macro);
    },
    toggleDebugMode: function() {
      if(!_adapter.debug) {
        _adapter.setDebugMode();
        $rootScope.debugMode = true;
      } else {
        _adapter.unsetDebugMode();
        $rootScope.debugMode = false;
      }
    },
    getDebugData: function() {
      return _adapter.getDebugData();
    },
    getApplicationLogs: function() {
      return _adapter.getApplicationLogs();
    },
    getSasErrors: function() {
      return _adapter.getSasErrors();
    },
    getFailedRequests: function() {
      return _adapter.getFailedRequests();
    },
    setCredentials: function(user, pass) {
      return _adapter.setCredentials(user, pass);
    },
    clearApplicationLogs: function() {
      _adapter.clearApplicationLogs();
    },
    clearDebugData: function() {
      _adapter.clearDebugData();
    },
    clearSasErrors: function() {
      _adapter.clearSasErrors();
    },
    clearFailedRequests: function() {
      _adapter.clearFailedRequests();
    },
    isDebugMode : function() {
      return _adapter.debug;
    },
    onRemoteConfigUpdate: function(callback) {
      _adapter.onRemoteConfigUpdate(callback);
    }
  };
});
