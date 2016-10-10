(function() {
  'use strict';

  angular
    .module('bDay')
    .factory('WeatherType', wTypeFactory);

  wTypeFactory.$inject = ['$resource', 'ApiSettings'];

  function wTypeFactory($resource, ApiSettings) {
    return $resource(ApiSettings.url + 'weather_types');
  }
})();
