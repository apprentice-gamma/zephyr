(function(){
	angular
		.module('zephyr')
		.factory('FlightFactory', FlightFactory);

	function FlightFactory($https) {
		var factory = {};
			factory.depAirportLoc = {};
			factory.arrAirportLoc = {};
			factory.schlGateDep = undefined;
			factory.schlGateArr = undefined;
			factory.flight = undefined;
			factory.flightComponents = {};
			factory.today = "2015/4/21"
			// factory.apiurl = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/DAL/2128/DEP/2015/4/21?appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";
			factory.apibase = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/";
			factory.suffix = "?appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false"

			        	//methods
            factory.getFlightData = getFlightData;

        	//method declarations

            function getFlightData(direction) {
            	var url = factory.apibase;
            	url += flightComponents.airline + '/' + flightComponents.number + '/';
            	url += direction + '/';
            	url += factory.today;
            	url += factory.suffix;

                $http.get(url).
                    success(function(data, status, headers, config) {
						factory.depAirportLoc.lat = data.departureAirport.latitude;
						factory.depAirportLoc.lon = data.departureAirport.longitude;
						factory.arrAirportLoc.lat = data.arrivalAirport.latitude;
						factory.arrAirportLoc.lon = data.arrivalAirport.longitude;
						factory.schlGateDep = data.operationalTimes.scheduledGateDeparture.dateUtc;
						factory.schlGateArr = data.operationalTimes.estimatedGateArrival.dateUtc;

						console.log(data);

                    //     if(data.owned_households !== undefined)                
                    //         factory.flight = data.owned_households;
                    //     else
                    //         factory.flight = data[0].owned_households;
                    // }).
                    // error(function(data, status, headers, config) {
                    //     console.log("There was an error retrieving JSON data");// log error
                    // });
            		}

		return factory;
	}
})();