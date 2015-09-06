'use strict';

/* Controllers */

var veloControllers = angular.module('veloControllers', ['ngStorage','ngCordova']);

veloControllers.controller('VeloAbstractCtrl', ['$scope', 'VeloService',
  function($scope, VeloService) {
	  $scope.isSearching=false;
	  $scope.isConnectionError=false;

	  $scope.actions = {
	  	// default actions to show for a station => override in specific controller if needed
		save: true,
		remove: true,
		map: true,
		reorder: false
	  }

	  $scope.swipe = function(target) {
	  	location.href = target;
	  }

	  $scope.addToSavedStations = function(station) {
		  VeloService.addSavedStation(station);
	  }

	  $scope.removeFromSavedStations = function(station) {
		  VeloService.removeSavedStation(station);
	  }

	  $scope.toggleActions = function(index) {
	  	var actions = $('#station-actions-'+index);
		if(actions) {
	  		var button = $('#toggle-actions-'+index);
			if(actions.is(":visible")) {
				actions.hide();
				if(button) {
					button.removeClass('ion-chevron-up');
					button.addClass('ion-chevron-down');
				}
			} else {
				actions.show();
				if(button) {
					button.addClass('ion-chevron-up');
					button.removeClass('ion-chevron-down');
				}
			}
		}
	  }

	  $scope.forceRefresh = function() {
		alert('a');
	  	VeloService.retrieveAndUpdateScope($scope,true);
	  }

	  VeloService.retrieveAndUpdateScope($scope,false);
  }]);

veloControllers.controller('VeloMainCtrl', ['$scope', '$controller', 'VeloService',
  function($scope, $controller, VeloService) {
	  $controller('VeloAbstractCtrl', {$scope: $scope})

	  $scope.actions.reorder = true;

	  $scope.moveUp = function(idx) {
	  	if(idx == 0) {
			return;
		}
		var tmp = $scope.savedStations[idx];
		$scope.savedStations[idx] = $scope.savedStations[idx-1];
		$scope.savedStations[idx-1] = tmp;
		VeloService.setSavedStations($scope.savedStations);
	  }
	  $scope.moveDown = function(idx) {
	  	if(idx == $scope.savedStations.length) {
			return;
		}
		var tmp = $scope.savedStations[idx];
		$scope.savedStations[idx] = $scope.savedStations[idx+1];
		$scope.savedStations[idx+1] = tmp;
		VeloService.setSavedStations($scope.savedStations);
	  }

	  $scope.savedStations = VeloService.getSavedStations();
  }]);

veloControllers.controller('VeloStationCtrl', ['$scope', '$stateParams','$controller',
  function($scope, $stateParams, $controller) {
	  $controller('VeloAbstractCtrl', {$scope: $scope})

          $scope.stationId="";
          if($stateParams.stationId){
                  $scope.stationId = $stateParams.stationId;
          }
  }]);

veloControllers.controller('VeloSearchStationCtrl', ['$scope', '$controller',
  function($scope, $controller) {
	  $controller('VeloAbstractCtrl', {$scope: $scope})
  }]);

veloControllers.controller('VeloSearchNearbyCtrl', ['$scope', '$localStorage', '$cordovaGeolocation', '$controller',
  function($scope, $localStorage, $cordovaGeolocation, $controller) {
	  $controller('VeloAbstractCtrl', {$scope: $scope})

	  $scope.position=null;
	  $scope.getLocation = function() {
		  $scope.isSearching=true;
		  $cordovaGeolocation.getCurrentPosition({timeout: 60000, enableHighAccuracy: false, maximumAge: 30000 })
			.then(function (position) {
				$scope.position = position;
		  		$scope.isSearching=false;
			}, function(err) {
				console.log("Error getting geo location "+JSON.stringify(err,null,4));
		  		$scope.isSearching=false;
			});
	  }

	  $scope.radiusUpdate = function() {
		  if(this.radius1) {
		  	$localStorage.radius1 = this.radius1;
		  }
	  }

	  if($localStorage.radius1){
		  $scope.radius1 = $localStorage.radius1;
	  } else {
		  $scope.radius1 = .5;
	  }
	  $scope.getLocation();
  }]);

veloControllers.controller('VeloSearchAddressCtrl', ['$scope', '$localStorage', '$controller',
  function($scope, $localStorage, $controller) {
	  $controller('VeloAbstractCtrl', {$scope: $scope})

	  $scope.radiusUpdate = function() {
		  if(this.radius2) {
		  	$localStorage.radius2 = this.radius2;
		  }
	  }

	  if(!$scope.autocomplete) {
		  if($localStorage.radius2){
		  	  $scope.radius2 = $localStorage.radius2;
		  } else {
			  $scope.radius2 = .5;
		  }
		  var input = document.getElementById('addressQuery');
        	  var options = {
                	  componentRestrictions: { 'country': 'BE'/*, 'locality': 'Antwerpen'*/ }
        	  };
        	  $scope.autocomplete = new google.maps.places.Autocomplete(input, options);
        	  google.maps.event.addListener($scope.autocomplete,
			  'place_changed', function() {
				  var geometry = $scope.autocomplete.getPlace().geometry.location
				  $scope.position = { 'coords': { 'longitude': geometry.lng(), 'latitude': geometry.lat() } };
				  $scope.$apply();
		  });
	  }

  }]);

veloControllers.controller('VeloRouteCtrl', ['$scope', '$controller',
  function($scope, $controller) {
	  $controller('VeloAbstractCtrl', {$scope: $scope})
	  $scope.stationsSet=false;

	  $scope.setFromStation = function(station) {
	  	if(station) {
			$scope.fromStation = station;
			$scope.fromStationQuery = station.name;
			var fs = $('#fromStationQuery');
			fs.val(station.name);
			var rl = $('#fromResultList');
			rl.hide();
			var ic = $('#fromSearchIcon');
			ic.removeClass('ion-search');
			ic.addClass('ion-close-round');

			$scope.checkStationsSet();
	  	}
	  }
	  $scope.setToStation = function(station) {
	  	if(station) {
			$scope.toStation = station;
			$scope.toStationQuery = station.name;
			var ft = $('#toStationQuery');
			ft.val(station.name);
			var rl = $('#toResultList');
			rl.hide();
			var ic = $('#toSearchIcon');
			ic.removeClass('ion-search');
			ic.addClass('ion-close-round');

			$scope.checkStationsSet();
	  	}
	  }
	  $scope.resetFromStation = function() {
		$scope.fromStation = null;
		$scope.fromStationQuery = null;
	  	var fs = $('#fromStationQuery');
		fs.val(null);
	  	var rl = $('#fromResultList');
	  	rl.show();
		var ic = $('#fromSearchIcon');
		ic.addClass('ion-search');
		ic.removeClass('ion-close-round');

		$scope.checkStationsSet();
	  }
	  $scope.resetToStation = function() {
		$scope.toStation = null;
		$scope.toStationQuery = null;
	  	var ft = $('#toStationQuery');
		ft.val(null);
	  	var rl = $('#toResultList');
	  	rl.show();
		var ic = $('#toSearchIcon');
		ic.addClass('ion-search');
		ic.removeClass('ion-close-round');

		$scope.checkStationsSet();
	  }

	  $scope.checkStationsSet = function() {
	  	if(!$scope.fromStation || !$scope.toStation) {
			$scope.stationsSet = false;
		} else {
			$scope.stationsSet = true;
		}
	  }
  }]);

