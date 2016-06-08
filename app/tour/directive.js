angular.module('ngmTour')

.directive('ngmTour', [
  'ngmTour',
  function(ngmTour) {
    return {
      restrict: 'A',
      link: function() {
        if(!ngmTour.isDone()) {
          setTimeout(function() {
            ngmTour.start();
          }, 500);
        }
      }
    };
  }
]);
