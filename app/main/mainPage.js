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
  'sasAdapter',
  function($scope, sasAdapter) {
    var tablesMap = {};
    $scope.libs = [];

    $scope.$watch('sideData.library', function(newValue) {
      if(!$scope.sideData.library) {
        return;
      }
      //moved to next event loop tick with timeout
      //setting timeout enables the selected item to finish animation first and then update the Tables select
      setTimeout(function() {
        $scope.$parent.tables = tablesMap[newValue];
      }, 0);
      //deselect table if it doesn't exist in sub array
      if(tablesMap[newValue] && tablesMap[newValue].indexOf($scope.sideData.table) === -1) {
        $scope.sideData.table = undefined;
      }
    });

    $scope.$watch('sideData.table', function() {
      if(!$scope.sideData.table) {
        $scope.tableInfo = {};
        return;
      }
      var table = sasAdapter.createTable([
        {libname: $scope.sideData.library, memname: $scope.sideData.table}
      ], 'memberDetails');

      sasAdapter.call('/Apps/tableEditor/getMemberDetails', table).then(function(res) {
        $scope.tableInfo = res.memInfo[0];
      }, function(err) {
        alert(err);
      });
    });

    sasAdapter.call('/Apps/tableEditor/startupService').then(function(res) {
      res.libsmems.forEach(function(lib) {
        if($scope.libs.indexOf(lib.LIBNAME) === -1) {
          $scope.libs.push(lib.LIBNAME);
        }
        //create sub array if it doesn't exist
        if(!tablesMap[lib.LIBNAME]) {
          tablesMap[lib.LIBNAME] = [];
        }
        if(tablesMap[lib.LIBNAME].indexOf(lib.MEMNAME) === -1) {
          tablesMap[lib.LIBNAME].push(lib.MEMNAME);
        }
      });
    }, function(err) {
      alert(err);
    });
  }
])

.controller('MainCtrl', [
  '$scope',
  'sasAdapter',
  '$rootScope',
  '$mdToast',
  '$mdDialog',
  function ($scope, sasAdapter, $rootScope, $mdToast, $mdDialog) {
    $scope.loading = false;
    $scope.tables = []; //used in child scope of SideCtrl
    $scope.sideData = {}; //used in child scope of SideCtrl
    var table;

    var toast = $mdToast.build({
      hideDelay: 1800,
      position: 'bottom right'
    });

    $scope.onHandsontableError = function(msg) {
      toast.template('<md-toast class="error"><div>' + msg +'</div></md-toast>');
      $mdToast.show(toast);
    };

    $scope.onHandsontableDataEdit = function(changes, instance) {
      $scope.tableDataChanged = true;

      $scope.tableIsValid = true;
      instance.getCellsMeta().forEach(function(cell) {
        if(cell.valid === false) {
          $scope.tableIsValid = false;
        }
      });
    };

    $scope.open = function() {
      $scope.loading = true;
      table = sasAdapter.createTable([
        {libname: $scope.sideData.library, memname: $scope.sideData.table}
      ], 'data', 10 * 1000);

      sasAdapter.call('/Apps/tableEditor/getTable', table).then(function(res) {
        $scope.loading = false;
        $scope.htDynamicSpec = res.columnspec;
        $scope.htData = res.tabledata;

        $scope.tableDataChanged = false;
      }, function(err) {
        alert(err);
      });
    };

    $scope.save = function() {
      if($scope.tableIsValid === false) {
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Save Error')
            .textContent('Your data is invalid and cannot be saved. Please check the table for red cells.')
            .ariaLabel('Save Error - invalid table data')
            .ok('OK')
        );
      } else {
        $scope.loading = true;
        table.add($scope.htData, 'tabledata');
        sasAdapter.call('/Apps/tableEditor/writeTable', table).then(function(res) {
          $scope.loading = false;
          $scope.htDynamicSpec = res.columnspec;
          $scope.htData = res.tabledata;

          $scope.tableDataChanged = false;
        }, function(err) {
          alert(err);
        });
      }
    };

    $scope.saveAs = function() {
      //TODO: use template with required input field
      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        controller: [
          '$scope',
          function($scope) {
            $scope.local = {};

            $scope.local.cancel = function() {
              delete $scope.local;
              $mdDialog.hide();
            };

            $scope.local.save = function() {
              if(!$scope.local.table) {
                return;
              }
              $scope.loading = true;

              table = sasAdapter.createTable([
                {libname: $scope.sideData.library, memname: $scope.local.table}
              ], 'data', 10 * 1000);
              table.add($scope.htData, 'tabledata');

              sasAdapter.call('/Apps/tableEditor/writeTable', table).then(function(res) {
                $scope.tables.push($scope.local.table);
                $scope.sideData.table = $scope.local.table;
                delete $scope.local.table;

                $scope.loading = false;
                $scope.htDynamicSpec = res.columnspec;
                $scope.htData = res.tabledata;

                $scope.tableDataChanged = false;

                delete $scope.local;
              }, function(err) {
                delete $scope.local;
                alert(err);
              });

              $mdDialog.hide();
            };
          }
        ],
        templateUrl: 'main/saveAsDialog.html'
      });
    };

    $scope.delete = function() {
      var confirm = $mdDialog.confirm()
        .title('Delete')
        .textContent('Are you sure you want to delete table ' + $scope.sideData.table + '?')
        .ariaLabel('Delete table')
        .ok('Delete')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        table = sasAdapter.createTable([
          {libname: $scope.sideData.library, memname: $scope.sideData.table}
        ], 'data');

        sasAdapter.call('/Apps/tableEditor/deleteTable', table).then(function(res) {
          for(var i = 0; i < $scope.tables.length; i++) {
            if($scope.sideData.table.toLowerCase() === $scope.tables[i].toLowerCase()) {
              $scope.tables.splice(i, 1);
              $scope.sideData.table = null;
              $scope.htData = null;
              $scope.htDynamicSpec = null;
              return;
            }
          }
        });
      });

    };
  }
]);
