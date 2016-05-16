angular.module('dynamicHandsontable', ['ngHandsontable'])

.directive('htDynamic', function(hotRegisterer, $timeout) {
  return {
    restrict: 'E',
    scope: {
      spec: '=',
      data: '=',
      errorHandler: '=',
      hotId: '@'
    },
    templateUrl: 'dynamicHandsontable/template.html',
    controller: function($scope) {
      $scope.hotId = 'table-' + Math.random().toString(16).slice(2);

      var getType = function(typeInt) {
        switch(typeInt) {
          case 2:
            return 'text';
          case 1:
            return 'numeric';
        }
      };

      $scope.$watch('spec', function() {
        if($scope.spec && $scope.data) {

          $scope.columns = $scope.spec.map(function(s) {
            return {
              // type: getType(s.TYPE),
              data: s.NAME.toUpperCase(),
              title: s.NAME
            };
          });


          $scope.settings = {
            beforeChange: function (changes) {
              if(changes.length === 0) return;

              for(var i = 0; i < $scope.spec.length; i++) {
                for(var j = 0; j < changes.length; j++) {
                  if(changes[j][1] === $scope.spec[i].NAME.toUpperCase()) {
                    if(getType($scope.spec[i].TYPE) !== 'numeric') {
                      if(changes[j][3].length > $scope.spec[i].LENGTH) {
                        $scope.errorHandler('Max length exceeded');
                        changes.splice(j, 1);
                      }
                    } else {
                      if(isNaN(changes[j][3])) {
                        $scope.errorHandler('Only numeric values are accepted');
                        changes.splice(j, 1);
                      } else {
                        changes[j][3] = changes[j][3] && parseFloat(changes[j][3]);
                      }
                    }
                  }
                }
              }
            },
            afterChange: function(changes, source) {
              if(source === 'loadData') {
                $timeout(function() {
                  insertEmptyRow();
                }, 0);
                return;
              }

              var instance = hotRegisterer.getInstance($scope.hotId);

              var rowInd;
              for(var i = changes.length - 1; i >= 0; i--) {
                //skip this change if we had another from the same row
                if(rowInd === changes[i][0]) {
                  continue;
                }
                rowInd = changes[i][0];
                //if it's last row and it's empty
                if(rowInd === instance.countRows() - 1 && !instance.isEmptyRow(instance.countRows() - 1)) {
                  insertEmptyRow();
                  break;
                } else if(rowInd !== instance.countRows() - 1 && instance.isEmptyRow(changes[i][0])) {
                  instance.alter('remove_row', rowInd);
                }
              }
              rowInd = null;
            }
          };
        }
      });

      function insertEmptyRow() {
        var instance = hotRegisterer.getInstance($scope.hotId);
        instance.alter('insert_row');
      }
    }
  };
});
