angular.module('myApp.main')

.directive('ngUpload', [
  '$http',
  function($http) {
    return {
      restrict: 'A',
      scope: {
        callback: '=ngUpload'
      },
      link: function(scope, element) {
        element.bind('dragenter', function(e) {
          e.preventDefault();
          element[0].style.border = '2px dashed #7e97bb';
          element[0].style.position = 'relative';
          element.append('<span id="dropFileMsg" class="center">Drop your file here</span>');
        });
        element.bind('dragleave', function(e) {
          clean();
        });
        element.bind('dragover', function(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        });
        element.bind('drop', function(e) {
          e.preventDefault();
          e.stopPropagation();

          var fd = new FormData();
          fd.append('_program', '/Apps/tableEditor/processUpload');
          fd.append('file', e.dataTransfer.files[0]);

          var xhr = $http.post('/SASStoredProcess/do', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
          })
          .success(function(res) {
            clean();
            scope.callback(res);
          })
          .error(function(err) {
            alert(err);
          });
        });

        function clean() {
          element[0].style.border = 'none';
          element[0].style.position = 'static';
          angular.element(document.querySelector('#dropFileMsg')).remove();
        }
      }
    };
  }
]);
