(function() {
  'use strict';

  angular.module(
    'bDay',
    [
      'parameters.config',
      'ngResource'
    ]
  );

  angular
    .module('bDay')
    .config(configFunction);

  configFunction.$inject = ['$httpProvider'];

  function configFunction($httpProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + btoa('usr1:usr1');
  }
})();
