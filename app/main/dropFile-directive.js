angular.module('myApp.main')

.directive('ngUpload', [
  '$mdDialog',
  '$compile',
  function($mdDialog, $compile) {
    return {
      restrict: 'A',
      templateUrl: 'main/dropFile.html',
      replace: false,
      transclude: true,
      scope: {
        callback: '=ngUpload'
      },
      link: function(scope, element) {
        scope.uploading = false;

        element.bind('dragenter', function(e) {
          if(scope.uploading) return;
          scope.fileOver = true;
          scope.$parent.$apply();
          e.preventDefault();
          e.stopPropagation();
          element[0].style.border = '2px dashed #7e97bb';
          element[0].style.position = 'relative';
        });
        element.bind('dragleave', function(e) {
          if(scope.uploading) return;
          scope.fileOver = false;
          scope.$parent.$apply();
          clean();
        });
        element.bind('dragover', function(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        });
        element.bind('drop', function(e) {
          e.preventDefault();
          if(scope.uploading) return;
          scope.fileOver = true;
          scope.$parent.$apply();
          scope.uploading = true;
          e.stopPropagation();

          var fd = new FormData();
          fd.append('_program', '/Apps/tableEditor/processUpload');
          fd.append('file', e.dataTransfer.files[0]);

          clean();
          element[0].style.position = 'relative';
          scope.uploadProgress = 0;

          var xhr;
          if (window.XDomainRequest && !/MSIE 1/.test(navigator.userAgent)) {
            xhr = new XDomainRequest('MSXML2.XMLHTTP.3.0');
          } else if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
          }

          xhr.upload.onprogress = function(e) {
            scope.uploadProgress = Math.ceil((e.loaded / e.total) * 100);
            scope.$apply();
          };

          xhr.onload = function(e) {
            scope.uploadProgress = 100;
            clean();
            scope.callback(JSON.parse(this.responseText));
            scope.uploading = false;
            scope.fileOver = false;
            scope.$parent.$apply();
          };

          xhr.onerror = function(e) {
            scope.uploading = false;
            scope.fileOver = false;
            scope.$parent.$apply();
            $mdDialog.show(
              $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Error')
                .textContent('An error occurred while transferring the file.')
                .ariaLabel('Error')
                .ok('OK')
            );
          };

          xhr.open('POST', '/SASStoredProcess/do');
          xhr.send(fd);
        });

        function clean() {
          element[0].style.border = 'none';
          element[0].style.position = 'static';
        }
      }
    };
  }
]);
