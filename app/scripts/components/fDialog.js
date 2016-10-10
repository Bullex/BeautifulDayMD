(function() {
  'use strict';

  function DialogController() {
    this.close = function() {
      console.log('close');
      this.forecast = undefined;
    };
  }

  angular
    .module('bDay')
    .component('fDialog', {
      controller: DialogController,
      bindings: {
        forecast: '=',
        action: '=',
        weatherTypes: '=',
        cities: '=',
        dates: '='
      },
      template: ['$element', '$timeout', function($element, $timeout) {
        $timeout(function() {
          var dialog = $element.find('dialog')[0];
          if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
          }
        }, 1000);

        return '<dialog class="mdl-dialog" ng-attr-open="{{ $ctrl.forecast }}"><form ng-submit="$ctrl.action[\'submit\']($event); $ctrl.close();"><h4 class="mdl-dialog__title">{{ $ctrl.action[\'name\'] }} <span ng-if="$ctrl.action[\'type\'] === \'edit\'">({{ $ctrl.forecast.date }})</span></h4><div class="mdl-dialog__content">' +
          '<div class="mdl-dropdown" ng-show="$ctrl.action[\'type\'] === \'add\'"><h6 ng-bind="$ctrl.forecast.date || \'Выберите дату\'"></h6><input class="modal-hidden-input" type="text" ng-model="$ctrl.forecast.date" required><div class="mdl-layout-spacer"></div><a id="datebtn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"><i class="material-icons" role="presentation">arrow_drop_down</i><span class="visuallyhidden">Dates</span></a><ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="datebtn"><li class="mdl-menu__item" ng-repeat="date in $ctrl.dates" ng-if="date != $ctrl.forecast.date" ng-click="$ctrl.action[\'setDate\'](date)">{{ date }}</li></ul></div>' +
          '<div class="mdl-dropdown"><h6 ng-bind="$ctrl.forecast.city.name"></h6><div class="mdl-layout-spacer"></div><a id="citybtn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"><i class="material-icons" role="presentation">arrow_drop_down</i><span class="visuallyhidden">Cities</span></a><ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="citybtn"><li class="mdl-menu__item" ng-repeat="loop_city in $ctrl.cities" ng-if="loop_city.id != $ctrl.forecast.city_id" ng-click="$ctrl.action[\'setCity\'](loop_city)">{{ loop_city.name }}</li></ul></div>' +
          '<div class="mdl-dropdown"><h6 ng-bind="$ctrl.forecast.type || \'Выберите тип погоды\'"></h6><input class="modal-hidden-input" type="text" ng-model="$ctrl.forecast.type" required><div class="mdl-layout-spacer"></div><a id="typebtn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"><i class="material-icons" role="presentation">arrow_drop_down</i><span class="visuallyhidden">Weather Types</span></a><ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="typebtn"><li class="mdl-menu__item" ng-repeat="(key, value) in $ctrl.weatherTypes" ng-if="key != $ctrl.forecast.weather_type" ng-click="$ctrl.action[\'setType\'](key, value)">{{ value }}</li></ul></div>' +
          '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" ng-class="{\'is-dirty\': $ctrl.forecast.t_day !== undefined}"><input class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="d_temp" ng-model="$ctrl.forecast.t_day" value="0" ng-required="$ctrl.forecast"><label class="mdl-textfield__label" for="d_temp">Day temperature</label><span class="mdl-textfield__error">Input is not a number!</span></div><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" ng-class="{\'is-dirty\': $ctrl.forecast.t_night !== undefined}"><input class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="n_temp" ng-model="$ctrl.forecast.t_night" ng-required="$ctrl.forecast"><label class="mdl-textfield__label" for="n_temp">Night temperature</label><span class="mdl-textfield__error">Input is not a number!</span></div></div><div class="mdl-dialog__actions"><button type="submit" class="mdl-button">Apply</button><a type="button" class="mdl-button close" ng-click="$ctrl.close()">Cancel</button></div></form></dialog>';
      }]
    });
})();
