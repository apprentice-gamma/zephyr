(function() {
        angular
            .module('zephyr')
            .factory('DirectionFactory', DirectionFactory);

        function DirectionFactory($http, $q) {
            var factory = {};
            factory.userLocation = undefined;
            factory.latitude = undefined;
            factory.longitude = undefined;
            factory.drivingMinutes = 0;
            factory.drivingETA = 0;
            factory.airport = {};

            factory.destLat = "42.216172";          //DEFAULT TO DTW
            factory.destLong = "-83.355384";

            factory.drivingData = {};

            factory.setAirportLocation = setAirportLocation;
            factory.getDistance = getDistance;

            function setAirportLocation() {
                if(factory.airport.latitude)
                    factory.destLat = factory.airport.latitude;
                if(factory.airport.longitude)
                    factory.destLon = factory.airport.longitude;
            }

            function getDistance() {
                formatUserLocation(factory.userLocation);
                setAirportLocation();
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
                    console.log('DRIVING DATA', factory.drivingData);
                    factory.drivingMinutes = factory.drivingData.duration / 60;
                    factory.drivingETA = formatTimeAsUTC(factory.drivingMinutes);
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
            return timeUTC;
        }

        return factory;
    }
})();