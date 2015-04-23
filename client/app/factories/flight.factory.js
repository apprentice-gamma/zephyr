(function(){
	angular
		.module('zephyr')
		.factory('FlightFactory', FlightFactory);

	function FlightFactory($http, $q) {
		var factory = {};
    		factory.flight = "dl2024";
    		factory.flightComponents = {};
            factory.flightStatus = {};
            factory.flightTimes = {};
            factory.connectionTime = 0;
    		
            factory.flightBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/";
    		factory.suffix = "?callback=JSON_CALLBACK&appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";
            
            factory.airportBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/airport/status/";
            factory.airportSuffix = "&numHours=5&maxFlights=25";

        		//methods
            factory.getFlightData = getFlightData;
            factory.findFlights = findFlights;
		
            function findFlights(airport, direction) {
              //parseFlightNumber(factory.flight);
              var url = buildAirport(airport, direction);
              console.log(url);
              var deferred = $q.defer();
              
              $http.jsonp(url).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                    console.log(data);
                    // factory.flightStatus = data.flightStatuses[0];
                    // factory.flightTimes = data.flightStatuses[0].operationalTimes;
                    // factory.connectionTime = getConnectionTime(direction);
                    // console.log('factory.connectionTime', factory.connectionTime);
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
                	factory.flightTimes = data.flightStatuses[0].operationalTimes;
                    factory.connectionTime = getConnectionTime(direction);
                	console.log('factory.connectionTime', factory.connectionTime);
            	})
            	.error(function() {
            		console.log('ERROR RETRIEVING FLIGHT JSONP DATA');
            		deferred.reject('ERROR DEFERRING');
            	});

            	return deferred.promise;
            } 


            function buildAirport(airport, direction) {
                var url = factory.airportBase;
                url += airport + '/';
                url += direction + '/';
                url += getTodayAsString();
                url += factory.airportSuffix;  
                url += factory.suffix;
                console.log('AIRPORT SEARCH URL:' + url);

                return url;
            }

            function getTodayAsString() {
        	   var d = new Date();
        	   var string = "";
        	   
        	   string = d.getFullYear();
        	   string += "/" + (d.getMonth() + 1);
        	   string += "/" + d.getDate();
        	   console.log(string);
        	   return string;
        	}

            function getConnectionTime(direction){
            	console.log('direction in getConTime', direction);
            	console.log('factory.flightTimes -------', factory.flightTimes);
            	if (direction === "dep") {
            		// factory.connectionTime = factory.flightTimes.estematedGateDeparture;
            		return factory.flightTimes.scheduledGateDeparture.dateUtc;
            	} else if (direction === "arr") {
            		// factory.connectionTime = factory.flightTimes.flightPlanPlannedArrival;
            		return factory.flightTimes.flightPlanPlannedArrival.dateUtc;
            	}

            }
                    

            function buildFlight(direction) {
        		var url = factory.flightBase;
            	url += factory.flightComponents.airline + '/' + factory.flightComponents.number + '/';
            	url += direction + '/';
            	url += getTodayAsString();
            	url += factory.suffix;  

            	return url;
            }

            function findAirports(airports) {
            	var fsDep = factory.flightStatuses.departureAirportFsCode;
            	var fsArr = factory.flightStatuses.arrivalAirportFsCode;

            	for (var i = 0; i < airports.length; i++) {
            		if(airports[i].fs === fsDep) {
            			factory.departureAirport = airports[i];
            		} else if(airports[i].fs === fsArr) {
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
            
		return factory;
  }
})();
