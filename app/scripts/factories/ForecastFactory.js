(function() {
  'use strict';

  angular
    .module('bDay')
    .factory('Forecast', forecastFactory);

  forecastFactory.$inject = ['$resource', 'ApiSettings'];

  function forecastFactory($resource, ApiSettings) {
    return $resource(ApiSettings.url + 'forecast(:id)', {id: '@_id'}, {
      update: {method: 'PUT'}
    });
  }
})();
