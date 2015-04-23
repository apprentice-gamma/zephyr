(function(){
  angular
    .module('zephyr')
    .factory('DirectionFactory', DirectionFactory);

  function DirectionFactory($http, $q) {
    var factory = {};
    factory.apibase = "https://maps.googleapis.com/maps/api/directions/json?origin=";
    factory.apisuffix = "&mode=driving&key=AIzaSyAd0RUfc4XbIBhZ-cNdViFL2yronVellCc";

    factory.userLocation = undefined;
    factory.latitude = undefined;
    factory.longitude = undefined;
    factory.drivingETA = 0;

    factory.destination = "42.2125,-83.3533";     //DELETE THIS LATER

    factory.getDrivingETAData = getDrivingETAData;

    function getDrivingETAData() {
      var deferred = $q.defer();

      formatUserLocation(factory.userLocation);
      var url = factory.apibase;
      url = url + factory.latitude + "," + factory.longitude;
      url = url + "&destination=" + factory.destination;
      url = url + factory.apisuffix;

      $http.get(url).
        success(function(data, status, headers, config) {
          deferred.resolve(data);
          console.log(data.routes[0].legs[0].duration.text);
          factory.drivingETA = ((data.routes[0].legs[0].duration.value )/ 60);
          factory.drivingETA = formatTimeAsUTC(factory.drivingETA);
          console.log(factory.drivingETA);
      }).error(function() {
          console.log('ERROR RETRIEVING DRIVING ETA');
          deferred.reject('ERROR DEFERRING DRIVING');
      });

      return deferred.promise;
    }

    function formatUserLocation(userLocation) {
      factory.latitude = String(Math.round(userLocation.coords.latitude*10000)/10000);
      factory.longitude = String(Math.round(userLocation.coords.longitude*10000)/10000);
    }

    function formatTimeAsUTC(input) {
      var timeUTC = new Date();
      timeUTC.setUTCMinutes(input);
      console.log(timeUTC);
      return timeUTC;
    }

    return factory;
  }
})();
