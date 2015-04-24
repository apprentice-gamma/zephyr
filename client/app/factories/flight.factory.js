
(function() {
    angular
        .module('zephyr')
        .factory('FlightFactory', FlightFactory);

    function FlightFactory($http, $q) {
        var factory = {};
        factory.flight = "dl2024";

        factory.flightComponents = {};
        factory.flightID = undefined;
        factory.flightStatus = {};
        factory.flightTimes = {};

        factory.connectionTime = 0;

        factory.flightsAtAirport = [];
        factory.arrival = false;

        factory.flightBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/";
        factory.suffix = "?callback=JSON_CALLBACK&appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";

        factory.airportBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/airport/status/";
        factory.airportSuffix = "&numHours=5&maxFlights=25";


        //methods
        factory.getFlightData = getFlightData;
        factory.getConnectionTimeFromFlightList = getConnectionTimeFromFlightList;
        factory.findFlights = findFlights;
        factory.calculateCountdown = calculateCountdown;

        function findFlights(airport, direction) {
            if (direction === "arr") {
                factory.arrival = true;
            }

            var url = buildAirport(airport, direction);
            console.log(url);
            var deferred = $q.defer();

            $http.jsonp(url).
            success(function(data, status, headers, config) {
                deferred.resolve(data);
                console.log(data);
                factory.flightsAtAirport = data.flightStatuses;
            })
                .error(function() {
                    console.log('ERROR RETRIEVING FLIGHT JSONP DATA');
                    deferred.reject('ERROR DEFERRING');
                });

            return deferred.promise;

        }

        function getFlightData(direction) {
            parseFlightNumber(factory.flight);
            var url = buildFlight(direction);
            console.log(url);
            var deferred = $q.defer();


            $http.jsonp(url).
            success(function(data, status, headers, config) {
                deferred.resolve(data);
                factory.flightStatus = data.flightStatuses[0];
                factory.flightID = data.flightStatuses[0].flightId;
                factory.flightTimes = data.flightStatuses[0].operationalTimes;
                factory.connectionTime = getConnectionTimeFromFlightData(direction);
            })
                .error(function() {
                    console.log('ERROR RETRIEVING FLIGHT JSONP DATA');
                    deferred.reject('ERROR DEFERRING');
                });

            return deferred.promise;
        }

        function dataFromFlightList(direction, index) {
            factory.connectionTime = getConnectionTimeFromFlightList(direction, index);

        }

        function buildAirport(airport, direction) {
            var url = factory.airportBase;
            url += airport + '/';
            url += direction + '/';
            url += getTodayAsString(true);
            url += factory.suffix;
            url += factory.airportSuffix;
            console.log('AIRPORT SEARCH URL:' + url);

            return url;
        }

        function getTodayAsString(needHour) {
            var d = new Date();
            var string = "";

            string = d.getFullYear();
            string += "/" + (d.getMonth() + 1);
            string += "/" + d.getDate();
            if (needHour) {
                string += "/" + d.getHours();
            }
            return string;
        }

        function getConnectionTimeFromFlightData(direction) {
            if (direction === "dep") {
                return factory.flightTimes.scheduledGateDeparture.dateUtc;
            } else if (direction === "arr") {
                return factory.flightTimes.flightPlanPlannedArrival.dateUtc;
            }

        }

        function getConnectionTimeFromFlightList(flight) {
            if (factory.arrival) {
                factory.connectionTime = flight.operationalTimes.flightPlanPlannedArrival.dateUtc;
            } else {
                factory.connectionTime = flight.operationalTimes.scheduledGateDeparture.dateUtc;
            }

        }


        function buildFlight(direction) {
            var url = factory.flightBase;
            url += factory.flightComponents.airline + '/' + factory.flightComponents.number + '/';
            url += direction + '/';
            url += getTodayAsString(false);
            url += factory.suffix;

            return url;
        }

        function findAirports(airports) {
            var fsDep = factory.flightStatuses.departureAirportFsCode;
            var fsArr = factory.flightStatuses.arrivalAirportFsCode;

            for (var i = 0; i < airports.length; i++) {
                if (airports[i].fs === fsDep) {
                    factory.departureAirport = airports[i];
                } else if (airports[i].fs === fsArr) {
                    factory.arrivalAirport = airports[i];
                }
            }
        }

        function parseFlightNumber(flightNumber) {
            var match = /\d/.exec(flightNumber);
            if (match) {
                factory.flightComponents.airline = flightNumber.slice(0, match.index).trim();
                factory.flightComponents.number = flightNumber.slice(match.index, flightNumber.length).trim();
            }
        }

        function calculateCountdown(input) {
            console.log("Calculation made");
            var d = new Date(input);
            var now = new Date();
            return (d.getTime() - now.getTime()) / 60000;
        }

        return factory;
    }
})();