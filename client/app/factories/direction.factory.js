(function(){
  angular
    .module('zephyr')
    .factory('DirectionFactory', DirectionFactory);

  function DirectionFactory($http) {
    var factory = {};
    factory.apibase = "https://maps.googleapis.com/maps/api/directions/jsonp?origin=";
    factory.apisuffix = "&mode=driving&key=AIzaSyAd0RUfc4XbIBhZ-cNdViFL2yronVellCc";

    factory.userLocation;
    factory.latitude;
    factory.longitude;
    factory.destination = "42.2125,-83.3533";     //DELETE THIS LATER

    factory.getDrivingETAData = getDrivingETAData;

    function getDrivingETAData() {
      formatUserLocation(factory.userLocation);
      var url = factory.apibase;
      url = url + factory.latitude + "," + factory.longitude;
      url = url + "&destination=" + factory.destination;
      url = url + factory.apisuffix

      $http.jsonp(url).
        success(function(data, status, headers, config) {
          console.log(data);
      });
    }

    function formatUserLocation(userLocation) {
      factory.latitude = String(Math.round(userLocation.coords.latitude*10000)/10000);
      factory.longitude = String(Math.round(userLocation.coords.longitude*10000)/10000);
    }

    return factory;
  }
})();