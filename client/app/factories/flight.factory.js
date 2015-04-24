(function() {
    angular
        .module('zephyr')
        .factory('FlightFactory', FlightFactory);

    function FlightFactory($http, $q) {
        var factory = {};
        factory.flight = "";
        factory.connectionTime = 0;
        factory.tsaTime = undefined;
        factory.avgTime = undefined;
        factory.showWait = false;

        factory.flightComponents = {};
        factory.flightID = undefined;
        factory.flightStatus = {};
        factory.flightTimes = {};
        factory.flightsAtAirport = [];
        factory.airports = [];

        factory.arrival = false;
        factory.suffix = "?callback=JSON_CALLBACK&appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";

        factory.flightBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/";
        factory.idBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/";
        factory.airportBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/airport/status/";
        factory.airportSuffix = "&numHours=5&maxFlights=25";

        //methods
        factory.getAirportFromFlight = getAirportFromFlight;
        factory.getAirportFromSearch = getAirportFromSearch;
        factory.getFlightData = getFlightData;
        factory.findFlights = findFlights;
        factory.getFlightByID = getFlightByID;
        factory.getTSAWaitTime = getTSAWaitTime;
        factory.getAvgWaitTime = getAvgWaitTime;
        factory.getConnectionTimeFromFlightList = getConnectionTimeFromFlightList;
        factory.calculateCountdown = calculateCountdown;

        function getAirportFromFlight() {
            var airport = {};
            var direction = "departureAirportFsCode";
            if (factory.arrival)
                direction = "arrivalAirportFsCode";

            for (var x = 0; x < factory.airports.length; x++) {
                if(factory.airports[x].fs === factory.FlightStatus[direction]){
                    //This is the airport
                    airport.fsCode = factory.airports[x].fs;
                    airport.name = factory.airports[x].name;
                    airport.latitude = factory.airports[x].latitude;
                    airport.longitude = factory.airports[x].longitude;
                }
            }

            return airport;
        }

        function getAirportFromSearch(airportFsCode) {
            var airport = {};
            var direction = "departureAirportFsCode";
            if (factory.arrival)
                direction = "arrivalAirportFsCode";

            for (var x = 0; x < factory.airports.length; x++) {
                if(factory.airports[x].fs === airportFsCode){
                    //This is the airport
                    airport.fsCode = factory.airports[x].fs;
                    airport.name = factory.airports[x].name;
                    airport.latitude = factory.airports[x].latitude;
                    airport.longitude = factory.airports[x].longitude;
                }
            }

            return airport;
        }

        function getFlightData(direction) {
            parseFlightNumber(factory.flight);
            var url = buildFlightURL(direction);
            console.log(url);
            var deferred = $q.defer();


            $http.jsonp(url).
            success(function(data, status, headers, config) {
                deferred.resolve(data);
                factory.flightStatus = data.flightStatuses[0];
                factory.flightID = data.flightStatuses[0].flightId;
                factory.flightTimes = data.flightStatuses[0].operationalTimes;
                factory.connectionTime = getConnectionTimeFromFlightData(direction);
                factory.airports = data.appendix.airports;
            })
                .error(function() {
                    console.log('ERROR RETRIEVING FLIGHT JSONP DATA');
                    deferred.reject('ERROR DEFERRING');
                });

            return deferred.promise;
        }

        function findFlights(airport, direction) {
            var url = buildAirportURL(airport, direction);
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

        function getFlightByID() {
            if (factory.flightID) {
                var url = factory.idBase + factory.flightID + factory.suffix;
                var direction = 'dep';
                if (factory.arrival)
                    direction = 'arr';

                $http.jsonp(url).
                success(function(data, status, headers, config) {
                    console.log(data);
                    factory.flightStatus = data.flightStatus;
                    factory.flightTimes = data.flightStatus.operationalTimes;
                    factory.connectionTime = getConnectionTimeFromFlightData(direction);
                })
                    .error(function() {
                        console.log('ERROR RETRIEVING FLIGHT JSONP DATA FROM ID');
                    });
            }
        }

        function getTSAWaitTime() {
            var deferred = $q.defer();
            $http.get('http://apps.tsa.dhs.gov/MyTSAWebService/GetWaitTimes.ashx?ap=DTW').success(function(data) {
                var avgWaitTime = 0;
                console.log('TSA WAIT TIMES:', data);
                for(var x = 0; x < 10; x++) {
                    switch(data.WaitTimes[x].WaitTimeIndex) {
                        case '1': avgWaitTime += 0;
                            break;
                        case '2': avgWaitTime += 10;
                            break;
                        case '3': avgWaitTime += 20;
                            break;
                        case '4': avgWaitTime += 30;
                            break;
                        case '5': avgWaitTime += 40;
                            break;
                        default: avgWaitTime += 0;
                    }
                }
                avgWaitTime = avgWaitTime / 10;
                avgWaitTime = Math.round((avgWaitTime / 10)) * 10;
                factory.tsaTime = avgWaitTime;
                deferred.resolve(avgWaitTime);
            })
            .error(function() {
                console.log("ERROR FETCHING WAIT TIME DATA");
                deferred.reject('WAIT TIME ERROR');
            });
            return deferred.promise;
        }

        function getAvgWaitTime() {
            var deferred = $q.defer();

            $http.get('http://www.flyontime.us/airports/DTW.xml').success(function(data) {
                console.log(' WAIT TIMES:', data);
                var shortIndex = data.indexOf('<short_delay>');
                var shortEnd = data.indexOf('</short_delay>');
                var shortTime = data.slice((shortIndex) + 13, shortEnd);

                var longIndex = data.indexOf('<long_delay>');
                var longEnd = data.indexOf('</long_delay>');
                var longTime = data.slice((longIndex) + 12, longEnd);

                var avgWaitTime = Math.round(((Number(shortTime) + Number(longTime)) / 2));
                factory.avgTime = avgWaitTime;
                deferred.resolve(avgWaitTime);
            }).error(function() {
                console.log('ERROR CONNECTING TO FLYONTIME');
                deferred.resolve('WAIT TIME ERROR');
            });

            return deferred.promise;
        }

        function buildAirportURL(airport, direction) {
            var url = factory.airportBase;
            url += airport + '/';
            url += direction + '/';
            url += getTodayAsString(true);
            url += factory.suffix;
            url += factory.airportSuffix;
            console.log('AIRPORT SEARCH URL:' + url);

            return url;
        }

        function buildFlightURL(direction) {
            var url = factory.flightBase;
            url += factory.flightComponents.airline + '/' + factory.flightComponents.number + '/';
            url += direction + '/';
            url += getTodayAsString(false);
            url += factory.suffix;

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