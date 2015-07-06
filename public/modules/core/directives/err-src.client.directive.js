'use strict';

angular.module('core').directive('errSrc', ['$http',
    function($http) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                attrs.$observe('ngSrc', function(ngSrc) {
                    $http.get(ngSrc).success(function() {

                    }).error(function() {
                  
                        element.attr('src', 'https://s3-us-west-2.amazonaws.com/suc-web/default/default_img.png'); // set default image
                    });
                });
            }
        };
    }
]);