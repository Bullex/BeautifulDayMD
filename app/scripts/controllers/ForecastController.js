(function() {
  'use strict';

  angular
    .module('bDay')
    .controller('ForecastController', ForecastController);

  ForecastController.$inject = ['$scope', '$filter', '$timeout', 'City', 'WeatherType', 'Forecast'];

  function ForecastController($scope, $filter, $timeout, City, WeatherType, Forecast) {
    $scope.isLoading = true;
    $scope.city = undefined;
    $scope.cities = [];
    $scope.weatherTypes = {};
    $scope.forecast = [];
    $scope.selectedForecast = undefined;
    $scope.today = $filter('date')(new Date(), 'dd.MM.yyyy');
    $scope.modalAction = {};

    // GET Cities
    City.get(function (resp) {
      $scope.cities = resp.d.results;
      $scope.city = $scope.cities[0];
    });

    // GET Weather Types
    WeatherType.get(function(resp) {
      var res = resp.d.results;
      res.forEach(function(type) {
        $scope.weatherTypes[type.code] = type.name;
      });

      // GET Forecast
      Forecast.get(function(resp) {
        $scope.forecast = resp.d.results;
        $scope.forecast.forEach(function(entry) {
          entry.day = getDay(entry.date);
          entry.isNow = entry.date === $scope.today ? true : undefined;
          entry.type = $scope.weatherTypes[entry.weather_type];
        });
        sortForecast();
        $scope.forecast = $scope.forecast.filter(function(fcast) {
          return fcast.date && fcast.weather_type;
        });
      });
    });

    // Change filter - City
    $scope.setCity = function(city) {
      $scope.city = city;
    };

    // DELETE Forecast (and remove f-cast element from array)
    $scope.deleteForecast = function(fcast) {
      Forecast.remove({id: fcast.id}, function() {
        $scope.forecast.splice($scope.forecast.indexOf(fcast), 1);
      });
    };

    // Open modal window
    $scope.openModal = function(fcast) {
      // if fcast exist (mean it's "edit" event)
      if (fcast) {
        // Set current city
        setCity($scope.city);
        // Fill actions
        fillModalAction('edit', function(e) {
          e.preventDefault();
          Forecast.update({id: fcast.id}, fcast);
        });
      } else {
        // Create new empty "fcast" object
        fcast = {};
        // Fill city
        setCity($scope.city);
        // Fill actions
        fillModalAction('add', function() {
          var newFCast = new Forecast();
          copyObject(fcast, newFCast);
          newFCast.$save();
          $scope.forecast.push(fcast);
          sortForecast();
        });
      }

      // Select a city
      $scope.modalAction['setCity'] = function(city) {
        setCity(city);
        rebuildDates(fcast.city);
        if (fcast.date) {
          setDate($scope.dates[0]);
        }
      };

      // Select a weather type
      $scope.modalAction['setType'] = function(code, value) {
        fcast.weather_type = code;
        fcast.type = value;
      };

      // Select a date
      $scope.modalAction['setDate'] = setDate;

      // Predefined filling of dates array
      rebuildDates(fcast.city);

      // Current "fcast" object
      $scope.selectedForecast = fcast;

      // Supporting functions
      function setCity(city) {
        fcast.city = city;
        fcast.city_id = city.id;
      }
      function setDate(date) {
        fcast.date = date;
        fcast.day = getDay(date);
      }
    };

    $timeout(function() {
      // Loader's manager
      $scope.isLoading = false;
    }, 1000);

    // Supporting functions
    function copyObject(from, to) {
      Object.keys(from).forEach(function(key) {
        to[key] = from[key];
      });
    }

    function fillModalAction(type, callback) {
      $scope.modalAction['type'] = type;
      $scope.modalAction['name'] = type === 'edit' ? 'Edit' : 'Add';
      $scope.modalAction['submit'] = callback;
    }

    $scope.dates = [];
    function findedDate(day, fcasts) {
      return fcasts.find(function(el) {
        return parseInt(el.day, 10) === day;
      });
    }

    function rebuildDates(city) {
      $scope.dates = [];
      var fcasts = $scope.forecast.filter(function(fcast) {
        return (parseInt(fcast.city_id, 10) === parseInt(city.id, 10)) && fcast.day;
      });
      if (fcasts.length) {
        for (var i = parseInt(fcasts[0].day, 10); i <= 31; i++) {
          if (!findedDate(i, fcasts)) {
            $scope.dates.push((i < 10 ? '0' + i : String(i)) + '.10.2016');
          }
        }
      }
    }

    function sortForecast() {
      $scope.forecast.sort(function (a, b) {
        if (!a.date) {
          return -1;
        }
        if (!b.date) {
          return 1;
        }
        var date1 = Date.parse(a.date.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$2/$1/$3'));
        var date2 = Date.parse(b.date.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$2/$1/$3'));

        if (date1 > date2) {
          return 1;
        }
        if (date1 < date2) {
          return -1;
        }
        return 0;
      });
    }

    function getDay(date) {
      return date ? date.split('.')[0] : '';
    }
  }
})();
