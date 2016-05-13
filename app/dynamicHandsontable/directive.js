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
          insertEmptyRow();

          $scope.columns = $scope.spec.map(function(s) {
            return {
              // type: getType(s.TYPE),
              data: s.NAME.toUpperCase(),
              title: s.NAME
            };
          });


          $scope.settings = {
            beforeChange: function (changes) {
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
                        changes[j][3] = parseFloat(changes[j][3]);
                      }
                    }
                  }
                }
              }
            },
            afterChange: function(changes, source) {
              if(source === 'loadData') {
                return;
              }

              var instance = hotRegisterer.getInstance($scope.hotId);

              for(var i = 0; i < changes.length; i++) {
                //if it's last row and it's empty
                if(changes[i][0] === $scope.data.length - 1 && !instance.isEmptyRow(instance.countRows() - 1)) {
                  insertEmptyRow();
                  break;
                } else if(changes[i][0] === $scope.data.length - 1 && instance.isEmptyRow(instance.countRows() - 1)) {
                  $scope.data.pop();
                  break;
                }
              }
            }
          };
        }
      });

      function insertEmptyRow() {
        var instance = hotRegisterer.getInstance($scope.hotId);

        var dataObj = {};
        $scope.spec.forEach(function(specObj) {
          dataObj[specObj.NAME] = null;
        });
        $scope.data.push(dataObj);
      }
    }
  };
});
