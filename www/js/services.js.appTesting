'use strict';

/* Services */

var veloServices = angular.module('veloServices', ['ngStorage']);

veloServices.factory('VeloService', ['$http','$localStorage',
  function($http, $localStorage){
	  var interval = 60000; // 60s
	  var lastInvocationTimestamp = 0;
	  var data = null;
	  var service = {
		getSavedStations : function(station){
			if(!$localStorage.savedStations) {
				$localStorage.savedStations = [];
			}
			return $localStorage.savedStations;
		},
                setSavedStations : function(savedStations){
                        if(!savedStations) {
                                $localStorage.savedStations = savedStations;
                        }
                },
		addSavedStation : function(station){
			if(!$localStorage.savedStations) {
				$localStorage.savedStations = [];
			}
                  	var index = $localStorage.savedStations.indexOf(station.id);
                  	if (index < 0) {
                        	$localStorage.savedStations.push(station.id);
                  	}
                  	station.saved = true;
		},
		removeSavedStation : function(station){
			if(!$localStorage.savedStations) {
				$localStorage.savedStations = [];
			}
                	var index = $localStorage.savedStations.indexOf(station.id);
                	if (index >= 0) {
                        	$localStorage.savedStations.splice(index,1);
                	}
                	station.saved = false;
		},
	  	retrieveAndUpdateScope : function(scope, force) {
			scope.isSearching=true;

			var currentTimestamp = Date.now();
			if(!force && !scope.isConnectionError && data && currentTimestamp - lastInvocationTimestamp < interval){
				scope.veloResponse = data;
				scope.isSearching=false;
				return;
			}
			lastInvocationTimestamp = currentTimestamp;

			scope.isConnectionError = false;

			service.retrieve()
				.then(function(d) {
					$.map(d, function(val) {
                    				val.name = val.name.substring(0,3)+" - "+val.name.substring(5);
		                       		val.saved = $.inArray(val.id,$localStorage.savedStations) > -1; 
						// save some memory by removing unused items
                                		delete val.district;
	                                	delete val.zip;
                                		delete val.address;
                                		delete val.addressNumber;
					});
					data = d;
					scope.isSearching=false;
					scope.veloResponse = data;
				})
				.catch(function(e) {
					scope.isConnectionError=true;
					scope.isSearching=false;
				})
		},
	  	retrieve : function() {
		  	var promise = $http.get('https://www.velo-antwerpen.be/availability_map/getJsonObject')
				.then(function(response) {
					return response.data;
				},
    				function(data) {
					throw "Connection error "+JSON.stringify(data,null,4);
  				 });
			return promise;
	  	}

	  }
	  return service;
    }
  ]);
