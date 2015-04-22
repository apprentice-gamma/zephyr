(function(){
	angular
		.module('zephyr')
		.factory('FlightFactory', FlightFactory);

	function FlightFactory($http) {
		var factory = {};
		factory.flight = "dl2024";
		factory.flightComponents = {};
		factory.flightStatus = {};
        factory.flightTimes = {};
		factory.today = "2015/4/21";
		factory.apibase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/";
		factory.suffix = "?callback=JSON_CALLBACK&appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";

	//methods
    factory.getFlightData = getFlightData;

    //method declarations

    function getFlightData(direction) {
      parseFlightNumber(factory.flight);
      var url = buildUrl(direction);
      console.log(url);
      
      $http.jsonp(url).
        success(function(data, status, headers, config) {
        	factory.flightStatus = data.flightStatuses[0];
        	factory.flightTimes = data.flightStatuses[0].operationalTimes;
            // findAirports(data.appendix.airports);
        	console.log(factory.flightTimes);
    	})
    	.error(function() {
    		console.log('ERROR RETRIEVING FLIGHT JSONP DATA');
    	});
    } 

    function buildUrl(direction) {
		var url = factory.apibase;
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
