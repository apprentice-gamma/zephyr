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
    factory.drivingETA = undefined;

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
          factory.drivingETA = data.routes[0].legs[0].duration.text;
          console.log(data.routes[0].legs[0].duration.text);
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

    return factory;
  }
})();
