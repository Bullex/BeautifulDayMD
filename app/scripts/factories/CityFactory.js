(function() {
  'use strict';

  angular
    .module('bDay')
    .factory('City', cityFactory);

  cityFactory.$inject = ['$resource', 'ApiSettings'];

  function cityFactory($resource, ApiSettings) {
    return $resource(ApiSettings.url + 'cities');
  }
})();
