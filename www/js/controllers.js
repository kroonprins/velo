'use strict';

/* Controllers */
// This would be much nicer using inheritance to avoid all this code deduplication between controllers...

var veloControllers = angular.module('veloControllers', ['ngStorage','ngCordova']);

veloControllers.controller('VeloMainCtrl', ['$scope', 'VeloService',
  function($scope, VeloService) {
	  $scope.isSearching=false;

	  $scope.addToSavedStations = function(station) {
		  VeloService.addSavedStation(station);
	  }

	  $scope.removeFromSavedStations = function(station) {
		  VeloService.removeSavedStation(station);
	  }

	  VeloService.retrieveAndUpdateScope($scope);
	  $scope.savedStations = VeloService.getSavedStations();
  }])

veloControllers.controller('VeloStationCtrl', ['$scope', '$stateParams','VeloService',
  function($scope, $stateParams, VeloService) {
	  $scope.isSearching=false;

	  $scope.addToSavedStations = function(station) {
		  VeloService.addSavedStation(station);
	  }

	  $scope.removeFromSavedStations = function(station) {
		  VeloService.removeSavedStation(station);
	  }

          $scope.stationId="";
          if($stateParams.stationId){
                  $scope.stationId = $stateParams.stationId;
          }

	  VeloService.retrieveAndUpdateScope($scope);
  }]);

veloControllers.controller('VeloSearchStationCtrl', ['$scope', 'VeloService',
  function($scope, VeloService) {
	  $scope.isSearching=false;

	  $scope.addToSavedStations = function(station) {
		  VeloService.addSavedStation(station);
	  }

	  $scope.removeFromSavedStations = function(station) {
		  VeloService.removeSavedStation(station);
	  }

	  VeloService.retrieveAndUpdateScope($scope);
  }]);

veloControllers.controller('VeloSearchNearbyCtrl', ['$scope', '$localStorage', '$cordovaGeolocation', 'VeloService',
  function($scope, $localStorage, $cordovaGeolocation, VeloService) {
	  $scope.isSearching=false;
	  $scope.position=null;

	  $scope.addToSavedStations = function(station) {
		  VeloService.addSavedStation(station);
	  }

	  $scope.removeFromSavedStations = function(station) {
		  VeloService.removeSavedStation(station);
	  }

	  $scope.getLocation = function() {
		  $scope.isSearching=true;
		  $cordovaGeolocation.getCurrentPosition({timeout: 15000, enableHighAccuracy: false })
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

	  VeloService.retrieveAndUpdateScope($scope);

	  if($localStorage.radius1){
		  $scope.radius1 = $localStorage.radius1;
	  } else {
		  $scope.radius1 = .5;
	  }
	  $scope.getLocation();
  }]);

veloControllers.controller('VeloSearchAddressCtrl', ['$scope', '$localStorage', 'VeloService',
  function($scope, $localStorage, VeloService) {
	  $scope.isSearching=false;

	  $scope.addToSavedStations = function(station) {
		  VeloService.addSavedStation(station);
	  }

	  $scope.removeFromSavedStations = function(station) {
		  VeloService.removeSavedStation(station);
	  }

	  $scope.radiusUpdate = function() {
		  if(this.radius2) {
		  	$localStorage.radius2 = this.radius2;
		  }
	  }

	  VeloService.retrieveAndUpdateScope($scope);

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
				  $scope.position = { 'coords': { 'longitude': geometry.F, 'latitude': geometry.A } };
				  $scope.$apply();
		  });
	  }

  }]);

veloControllers.controller('VeloRouteCtrl', ['$scope', 'VeloService',
  function($scope, VeloService) {
	  $scope.isSearching=false;
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
	  VeloService.retrieveAndUpdateScope($scope);
  }]);

