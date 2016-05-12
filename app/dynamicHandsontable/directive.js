angular.module('dynamicHandsontable', ['ngHandsontable'])

.directive('htDynamic', function($compile) {
  return {
    restrict: 'E',
    scope: {
      spec: '=',
      data: '=',
      errorHandler: '='
    },
    templateUrl: 'dynamicHandsontable/template.html',
    link: function(scope, element) {
      var getType = function(typeInt) {
        switch(typeInt) {
          case 2:
            return 'text';
          case 1:
            return 'numeric';
        }
      };

      scope.$watch('spec', function() {
        if(scope.spec) {
          scope.columns = scope.spec.map(function(s) {
            return {
              // type: getType(s.TYPE),
              data: s.NAME.toUpperCase(),
              title: s.NAME
            };
          });

          scope.settings = {
            beforeChange: function (changes) {
              for(var i = 0; i < scope.spec.length; i++) {
                for(var j = 0; j < changes.length; j++) {
                  if(changes[j][1] === scope.spec[i].NAME.toUpperCase()) {
                    if(getType(scope.spec[i].TYPE) !== 'numeric') {
                      if(changes[j][3].length > scope.spec[i].LENGTH) {
                        scope.errorHandler('Max length exceeded');
                        changes.splice(j, 1);
                      }
                    } else {
                      if(isNaN(changes[j][3])) {
                        scope.errorHandler('Only numeric values are accepted');
                        changes.splice(j, 1);
                      } else {
                        changes[j][3] = parseFloat(changes[j][3]);
                      }
                    }
                  }
                }
              }
            }
          };
        }
      });
    }
  };
});
