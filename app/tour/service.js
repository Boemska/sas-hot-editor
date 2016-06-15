angular.module('ngmTour', [])

.factory('ngmTour', [
  '$mdMedia',
  '$document',
  function($mdMedia, $document) {
    var items, itemInd, currentItem, tourEl, overlayEl, messageEl, nextButtonEl, wrapperEl;

    function clean() {
      overlayEl.remove();
      wrapperEl[0].style['transition-delay'] = '0s';
      wrapperEl[0].style['transition-duration'] = '0s';
      wrapperEl[0].style.opacity = 0;

      angular.element(currentItem).off('click', onSelectClick);
      angular.element(document.querySelectorAll('.md-select-menu-container.md-active md-option')).off('click', onSelectItemClick);
    }

    function display() {
      if(currentItem.clientWidth === 0 && currentItem.clientHeight === 0) {
        nextButtonEl.triggerHandler('click');
      }
      var boundingRect = currentItem.getBoundingClientRect();

      tourEl.prepend('<div class="overlay"></div>');
      overlayEl = angular.element(document.querySelector('#tour .overlay'));

      var color = angular.element(currentItem).attr('ngm-tour-color');
      if(color) {
        var r = parseInt('0x' + color.substr(1, 2)),
            g = parseInt('0x' + color.substr(3, 2)),
            b = parseInt('0x' + color.substr(5, 2));
        if(window.document.documentMode) {
          overlayEl[0].style['box-shadow'] = '0px 0px 0px 10000px rgba(' + r + ', ' + g + ', ' + b + ', 0.7)';
        } else {
          overlayEl[0].style['box-shadow'] = '0px 0px 0px 100vmax rgba(' + r + ', ' + g + ', ' + b + ', 0.7)';
        }
      } else if(window.document.documentMode) {
        overlayEl[0].style['box-shadow'] = '0px 0px 0px 10000px rgba(20, 129, 184, 0.7)';
      }

      overlayEl[0].style.top = boundingRect.top + currentItem.clientHeight / 2 + 'px';
      overlayEl[0].style.left = boundingRect.left + currentItem.clientWidth / 2 + 'px';
      overlayEl[0].style.width = boundingRect.width + 2 + 'px';
      overlayEl[0].style.height = boundingRect.height + 2 + 'px';

      messageEl[0].innerHTML = angular.element(currentItem).attr('ngm-tour-msg');

      wrapperEl[0].style.width = 'auto';

      if(!angular.element(currentItem).attr('ngm-tour-float')) {
        if(document.body.clientWidth - boundingRect.right > boundingRect.left) {
          //message and button should be on the right
          wrapperEl[0].style.top = '50%';
          wrapperEl[0].style.left = null;
          wrapperEl[0].style.right = (document.body.clientWidth - boundingRect.width - boundingRect.left - 2) / 2 + 'px';
          wrapperEl[0].style.transform = 'translate(50%, -50%)';
          if(wrapperEl[0].clientWidth > boundingRect.right) {
            wrapperEl[0].style.width = boundingRect.right + 'px';
          }
        } else {
          //message and button should be on the left
          wrapperEl[0].style.top = '50%';
          wrapperEl[0].style.right = null;
          wrapperEl[0].style.left = (document.body.clientWidth - boundingRect.width - (document.body.clientWidth - boundingRect.right) - 2) / 2 + 'px';
          wrapperEl[0].style.transform = 'translate(-50%, -50%)';
          if(wrapperEl[0].clientWidth > boundingRect.left) {
            wrapperEl[0].style.width = boundingRect.left + 'px';
          }
        }

        wrapperEl[0].style['transition-delay'] = '0.25s';
        wrapperEl[0].style['transition-duration'] = '0.5s';
        wrapperEl[0].style.opacity = 1;
      }

      angular.element(currentItem).on('click', onSelectClick);
    }

    function onSelectClick(e) {
      var selectEl = e.target;
      while(selectEl && selectEl.tagName !== 'MD-SELECT') {
        selectEl = selectEl.parentNode;
      }
      if(selectEl) {
        setTimeout(function() {
          var selectMenu = document.querySelector('.md-select-menu-container.md-active');
          var selectMenuBoundingRect = selectMenu.getBoundingClientRect();

          overlayEl[0].style.top = selectMenuBoundingRect.top + selectMenuBoundingRect.height / 2 + 'px';
          overlayEl[0].style.left = selectMenuBoundingRect.left + selectMenuBoundingRect.width / 2 + 'px';
          overlayEl[0].style.width = selectMenuBoundingRect.width + 2 + 'px';
          overlayEl[0].style.height = selectMenuBoundingRect.height + 2 + 'px';

          angular.element(document.querySelectorAll('.md-select-menu-container.md-active md-option')).on('click', onSelectItemClick);
        }, window.document.documentMode ? 1000 : 100 /*is IE*/);
      }
    }

    function onSelectItemClick(e) {
      var boundingRect = currentItem.getBoundingClientRect();
      overlayEl[0].style.top = boundingRect.top + currentItem.clientHeight / 2 + 'px';
      overlayEl[0].style.left = boundingRect.left + currentItem.clientWidth / 2 + 'px';
      overlayEl[0].style.width = boundingRect.width + 2 + 'px';
      overlayEl[0].style.height = boundingRect.height + 2 + 'px';
    }

    return {
      start: function() {
        //do not display tour on small devices
        if(!$mdMedia('gt-sm')) {
          return;
        }

        items = Array.prototype.slice.call(document.querySelectorAll('[ngm-tour-step]')).sort(function(itemA, itemB) {
          return angular.element(itemA).attr('ngm-tour-step') - angular.element(itemB).attr('ngm-tour-step');
        });

        itemInd = 0;
        currentItem = items[0];

        angular.element(document.body).append('<div id="tour"></div>');
        tourEl = angular.element(document.querySelector('#tour'));
        tourEl.append('<div class="wrapper"><div class="message"></div><md-button class="md-button button ">Next</md-button></div>');

        wrapperEl = angular.element(document.querySelector('#tour .wrapper'));
        messageEl = angular.element(document.querySelector('#tour .message'));
        nextButtonEl = angular.element(document.querySelector('#tour .button'));

        nextButtonEl.on('click', function() {
          if(nextButtonEl[0].innerHTML === 'Close') {
            tourEl.remove();
            tourEl = wrapperEl = messageEl = nextButtonEl = null; //remove reference so the GC can collect it
            window.localStorage.setItem('tourDone', true);
            return;
          }

          clean();

          if(++itemInd === items.length - 1) {
            nextButtonEl[0].innerHTML = 'Close';
          }

          currentItem = items[itemInd];
          display();
        });

        display();
      },
      isDone: function() {
        if(window.localStorage) {
          return window.localStorage.getItem('tourDone');
        } else {
          alert('Your browser does not support Local Storage.\nPlease upgrade to a newer browser');
        }
      }
    };
  }
]);
