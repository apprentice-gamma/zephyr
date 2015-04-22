(function(){
	angular
		.module('zephyr')
		.factory('FlightFactory', FlightFactory);

	function FlightFactory($http) {
		var factory = {};
    		factory.flight = undefined;
    		factory.flightComponents = {};
    		factory.today = "2015/4/21";
    		
            factory.flightBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/";
    		factory.suffix = "?callback=JSON_CALLBACK&appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";
            
            factory.airportBase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/airport/status/";
            factory.airportSuffix = "&numHours=5&maxFlights=25";

        		//methods
            factory.getFlightData = getFlightData;
            factory.findFlights = findFlights;

            //method declarations
            function getTodayAsString() {
                var d = new Date();
                var string = "";
                string = d.getFullYear();
                string += "/" d.getMonth();
                string += "/" d.getDate();
                console.log (string);
                return string;
            }

            function findFlights(airport) {

            }

            function getFlightData(direction) {
              parseFlightNumber(factory.flight);
              var url = buildFlight(direction);
              console.log(url);
              
              $http.jsonp(url).
                success(function(data, status, headers, config) {
                    console.log(data.flightStatuses[0]);
                	factory.flightStatus = data.flightStatuses;
                	factory.flightTimes = data.flightStatuses[0].operationalTimes;
                    //findAirports(data.appendix.airports);
                	console.log(data);
            	})
            	.error(function() {
            		console.log('ERROR RETRIEVING FLIGHT JSONP DATA');
            	});
            }

            function buildAirport(airport, direction) {
                var url = factory.airportBase;
                url += airport + '/';
                url += direction + '/';
                url += factory.today;
                url += factory.airportSuffix;  

                consol.log('AIRPORT SEARCH URL:' + url);

                return url;
            }

            function buildFlight(direction) {
        		var url = factory.flightBase;
            	url += factory.flightComponents.airline + '/' + factory.flightComponents.number + '/';
            	url += direction + '/';
            	url += factory.today;
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
