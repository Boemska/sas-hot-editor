angular.module('sasAdapter', ['ngToast', 'ngAnimate', 'ngSanitize', 'alerts'])

.factory('sasAdapter', function($q, $rootScope, ngToast, $timeout, alerts) {
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
      var loadingToastId = ngToast.create({
        className: 'info',
        content: 'Loading: <b>' + sasProgram + '</b>'
      });

      _adapter.call(sasProgram, table, function(err, res) {
        var toast;
        for(var i = 0; i < ngToast.messages.length; i++) {
          if(loadingToastId === ngToast.messages[i].id) {
            toast = ngToast.messages[i];
            break;
          }
        }

        if(err && (err.type === 'notLoggedinError' || err.type === 'loginError')) {
          ngToast.dismiss();
          $('#login-modal').modal({
            keyboard: false,
            backdrop: 'static'
          });
          return;
        }

        if(err) {
          if(toast) {
            toast.className = 'danger';
            toast.content = 'Error loading <b>' + sasProgram + '</b>';
          } else {
            ngToast.create({
              className: 'danger',
              content: 'Error loading <b>' + sasProgram + '</b>'
            });
          }
          deferred.reject(err);
        } else {
          if(toast) {
            toast.className = 'success';
            toast.content = 'Loaded: <b>' + sasProgram + '</b>';
          } else {
            ngToast.create({
              className: 'success',
              content: 'Loaded: <b>' + sasProgram + '</b>'
            });
          }

          if(res.usermessage !== 'blank') {
            alerts.create(res.usermessage, 'info');
          }

          deferred.resolve(res);
        }

        $timeout(function() {
          ngToast.dismiss(toast.id);
        }, 1500);
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
