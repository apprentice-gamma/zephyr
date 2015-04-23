(function() {
        angular
            .module('zephyr')
            .factory('DirectionFactory', DirectionFactory);

        function DirectionFactory($http, $q) {
            var factory = {};
            factory.userLocation = undefined;
            factory.latitude = undefined;
            factory.longitude = undefined;
            factory.drivingETA = 0;

            factory.destLat = "42.216172";
            factory.destLong = "-83.355384";

            factory.drivingData = {};

            factory.getDistance = getDistance;

            function getDistance() {
                formatUserLocation(factory.userLocation);
                console.log("LAT, LONG", factory.latitude, factory.longitude);
                var origin = new google.maps.LatLng(factory.latitude, factory.longitude);
                var destination = new google.maps.LatLng(factory.destLat, factory.destLong);
                var service = new google.maps.DistanceMatrixService();
                var deferred = $q.defer();

                service.getDistanceMatrix(
                  {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    durationInTraffic: true,
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                  }, callback);

                function callback(response, status) {
                    console.log('GOOGLE RESPONSE', response);
                    var routeData = response.rows[0].elements[0];
                    factory.drivingData.distance = routeData.distance.value;
                    factory.drivingData.duration = routeData.duration.value;
                    deferred.resolve(factory.drivingData);
                    console.log('Driving Data', factory.drivingData);
                    factory.drivingETA = formatTimeAsUTC(factory.drivingData.duration / 60);
                }

                return deferred.promise;
            }

        function formatUserLocation(userLocation) {
            factory.latitude = String(Math.round(userLocation.coords.latitude * 10000) / 10000);
            factory.longitude = String(Math.round(userLocation.coords.longitude * 10000) / 10000);
        }

        function formatTimeAsUTC(input) {
            var now = new Date();
            var timeUTC = new Date(now.getTime() + (input * 60000));
            console.log(timeUTC);
            return timeUTC;
        }

        return factory;
    }
})();