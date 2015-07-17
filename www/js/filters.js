'use strict';

/* Filters */
 angular.module('veloFilters', [])
 .filter('filterFromNumChars', ['$filter', function(filter) {
	return function(array, searchString, numberOfCharacters) {
		// works as the normal standard filter, except that it returns an empty list until the searchString has a bigger length than numberOfCharacters. This to avoid bad performance on mobile device.
		if(!searchString || searchString.length < numberOfCharacters){
			return [];
		}
		return filter('filter')(array,searchString);
	}
 }])
 .filter('filterListOfStations', function() {
         return function(input, stations) {
                 if(!input || !stations){
                         return [];
                 }
		 // interesting to investigate how this could be optimized
                 var filtered = $.grep(input,function(n){
                 	return $.inArray(n.id,stations) > -1; 
		 });
		 var result = [];
		 for (var i = 0; i < stations.length; i++) {
			 result = result.concat($.grep(filtered, function(n) {
				 return n.id == stations[i];
			 }));
		 }
		 return result;
	 };
 })
 .filter('filterStation', function() {
         return function(input, stationId) {
                 if(!input || stationId == ""){
                         return [];
                 }
                 return $.grep(input,function(n){
                         return n.id == stationId;
                 });
	 };
 })
 .filter('filterNearbyStations', function() {
         return function(input, stationId) {
                 if(!input || stationId == ""){
                         return [];
                 }
                 // get the station
                 var station = $.grep(input,function(n){
                         return n.id == stationId;
                 });
                 if(!station || station.length == 0){ 
                         return []; 
                 }
                 // append the nearby stations
                 var nearbyStations = station[0].nearbyStations.split(",");
                 return $.grep(input,function(n){
                         return $.inArray(n.id,nearbyStations) > -1; 
                 }); 
         };
 })
 .filter('filterNearbyStationsByDistance', function() {
         return function(input, position, radius) {
                 if(!input || !position || !position.coords.longitude || !position.coords.latitude){
                         return [];
                 }
                 var filtered =  $.grep(input,function(n){
                         var dist = distance(position.coords.latitude, position.coords.longitude, n.lat, n.lon, "K"); 
			 n.distance = dist;
			 return dist <= radius;
                 });
		 var sorted = filtered.sort(function(a,b) {
			 return ((a.distance < b.distance) ? -1 : ((a.distance > b.distance) ? 1 : 0));
		 }); 
		 return sorted;
         };
 });
