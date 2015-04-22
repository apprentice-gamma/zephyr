(function(){
	angular
		.module('zephyr')
		.factory('FlightFactory', FlightFactory);

	function FlightFactory($http) {
		var factory = {};
		factory.depAirportLoc = {};
		factory.arrAirportLoc = {};
		factory.schlGateDep = undefined;
		factory.schlGateArr = undefined;
		factory.flight = undefined;
		factory.flightComponents = {};
		factory.today = "2015/4/21";
		// factory.apiurl = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/DAL/2128/DEP/2015/4/21?appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";
		factory.apibase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/";
		factory.suffix = "?callback=JSON_CALLBACK&appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";

		//methods
    factory.getFlightData = getFlightData;

    //method declarations

    function getFlightData(direction) {
      parseFlightNumber(factory.flight);
    	var url = factory.apibase;
    	url += factory.flightComponents.airline + '/' + factory.flightComponents.number + '/';
    	url += direction + '/';
    	url += factory.today;
    	url += factory.suffix;
      console.log(url);
      $http.jsonp(url).
        success(function(data, status, headers, config) {
        	findAirports(data.appendix.airports);
        	factory.flightStatus = data.flightStatuses[0];
        	factory.flightTimes = data.flightStatuses[0].operationalTimes;
        	
			// factory.depAirportLoc.lat = data.departureAirport.latitude;
			// factory.depAirportLoc.lon = data.departureAirport.longitude;
			// factory.arrAirportLoc.lat = data.arrivalAirport.latitude;
			// factory.arrAirportLoc.lon = data.arrivalAirport.longitude;
			// factory.schlGateDep = data.operationalTimes.scheduledGateDeparture.dateUtc;
			// factory.schlGateArr = data.operationalTimes.estimatedGateArrival.dateUtc;
		      console.log(data);
    		});
    } 

    function findAirports(airports) {
    	var fsDep = factory.flightStatuses.departureAirportFsCode;
    	var fsArr = factory.flightStatuses.arrivalAirportFsCode;

    	for (var i = 0; i < airports.length; i++) {
    		if(airports[i].fs === fsDep) {
    			factory.departureAirport = airports[i]
    		} else if(airports[i].fs === fsArr) {
    			factory.arrivalAirport = airports[i]
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
