angular.module('dynamicHandsontable', ['ngHandsontable'])

.directive('htDynamic', [
  'hotRegisterer',
  '$timeout',
  '$window',
  function(hotRegisterer, $timeout, $window) {
    return {
      restrict: 'E',
      scope: {
        spec: '=',
        data: '=',
        errorHandler: '=',
        onDataChange: '=',
        hotId: '@',
        width: '@',
        height: '@'
      },
      templateUrl: 'dynamicHandsontable/template.html',
      controller: function($scope, $element) {
        $scope.hotId = 'table-' + Math.random().toString(16).slice(2);

        var getType = function(typeInt) {
          switch(typeInt) {
            case 2:
              return 'text';
            case 1:
              return 'numeric';
          }
        };

        angular.element($window).bind('resize', function() {
          var tableWidth = 0;
          if(!$scope.spec) {
            return;
          }

          setTimeout(function() {
            if($scope.width) {
              tableWidth = $scope.width;
            } else {
              var maxWidth = $element.parent().parent()[0].clientWidth - 32; //32px for margin
              $scope.spec.forEach(function(s) {
                tableWidth += parseInt(s.LENGTH) * 15;
              });
              tableWidth = Math.min(tableWidth, maxWidth);
            }
            updateTableSettings({width: tableWidth});
          }, 500);
        });

        $scope.$watch('spec', function() {
          if($scope.spec && $scope.data) {
            var tableWidth = 0;

            $scope.columns = $scope.spec.map(function(s) {
              return {
                // type: getType(s.TYPE),
                data: s.NAME.toUpperCase(),
                title: s.NAME
              };
            });

            if(!$scope.width) {
              var maxWidth = $element.parent().parent()[0].clientWidth - 32; //32px for margin
              $scope.spec.forEach(function(s) {
                tableWidth += parseInt(s.LENGTH) * 15;
              });
              tableWidth = Math.min(tableWidth, maxWidth);
            }

            updateTableSettings({width: $scope.width || tableWidth});

            $scope.settings = {
              autoWrapRow: true,
              stretchH: 'all',
              width: $scope.width || tableWidth,
              beforeChange: function (changes) {
                if(changes.length === 0) return;

                var instance = hotRegisterer.getInstance($scope.hotId);

                for(var i = 0; i < $scope.spec.length; i++) {
                  for(var j = 0; j < changes.length; j++) {
                    if(changes[j][1] === $scope.spec[i].NAME.toUpperCase()) {
                      var colIndex = $scope.columns.map(function(o) {
                        return o.data;
                      }).indexOf(changes[j][1]);

                      if(getType($scope.spec[i].TYPE) !== 'numeric') {
                        if(changes[j][3] && changes[j][3].length > $scope.spec[i].LENGTH) {
                          if($scope.spec[i].LENGTH.toString().slice(-1) === '1') {
                            $scope.errorHandler('Max length of ' + $scope.spec[i].LENGTH + ' character exceeded');
                          } else {
                            $scope.errorHandler('Max length of ' + $scope.spec[i].LENGTH + ' characters exceeded');
                          }
                          instance.setCellMeta(changes[j][0], colIndex, 'valid', false);
                        } else {
                          instance.setCellMeta(changes[j][0], colIndex, 'valid', true);
                        }
                      } else {
                        if(isNaN(changes[j][3])) {
                          $scope.errorHandler('Only numeric values are accepted');
                          instance.setCellMeta(changes[j][0], colIndex, 'valid', false);
                        } else {
                          instance.setCellMeta(changes[j][0], colIndex, 'valid', true);
                          changes[j][3] = changes[j][3] && parseFloat(changes[j][3]);
                        }

                        if(changes[j][3] === '') {
                          changes[j][3] = null;
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

                $scope.onDataChange(changes, instance);
              }
            };
          } else {
            $scope.columns = null;
          }
        });

        function insertEmptyRow() {
          var instance = hotRegisterer.getInstance($scope.hotId);
          instance.alter('insert_row');
        }

        function updateTableSettings(settings) {
          var instance = hotRegisterer.getInstance($scope.hotId);
          if(instance) {
            //the is already present, but width needs to be updated
            setTimeout(function() {
              instance.updateSettings(settings);
            }, 0);
          }
        }
      }
    };
  }
]);
