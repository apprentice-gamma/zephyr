(function(){
	angular
		.module('zephyr')
		.factory('FlightFactory', FlightFactory);

	function FlightFactory($http, $q) {
		var factory = {};
		factory.flight = "dl2024";
		factory.today = "2015/4/22";
		factory.flightComponents = {};
		factory.flightStatus = {};
        factory.flightTimes = {};
        factory.connectionTime = 0;
		factory.apibase = "https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/";
		factory.suffix = "?callback=JSON_CALLBACK&appId=588e049b&appKey=f9e4c706444bfc87888b78ddb64f00c8&utc=false";
    factory.airport = {};

	//methods
    factory.getFlightData = getFlightData;

    //method declarations
    //

    function getFlightData(direction) {
      parseFlightNumber(factory.flight);
      var url = buildUrl(direction);
      console.log(url);
      var deferred = $q.defer();
      
      $http.jsonp(url).
        success(function(data, status, headers, config) {
        //vvvvvvvv assuming position of dep and arr in airports array
          if (direction === "arr") {
            factory.airport.latitude = data.appendix.airports[0].latitude;
            factory.airport.longitude = data.appendix.airports[0].longitude;
          } else if (direction === "dep") {
            factory.airport.latitude = data.appendix.airports[1].latitude;
            factory.airport.longitude = data.appendix.airports[1].longitude;
          }
          console.log(factory.airport);
        	deferred.resolve(data);
        	factory.flightStatus = data.flightStatuses[0];
        	factory.flightTimes = data.flightStatuses[0].operationalTimes;
            factory.connectionTime = getConnectionTime(direction);
        	console.log('factory.connectionTime', factory.connectionTime);
    	})
    	.error(function() {
    		console.log('ERROR RETRIEVING FLIGHT JSONP DATA');
    		deferred.reject('ERROR DEFERRING FLIGHT');
    	});

    	return deferred.promise;
    } 

    function buildUrl(direction) {
		var url = factory.apibase;
    	url += factory.flightComponents.airline + '/' + factory.flightComponents.number + '/';
    	url += direction + '/';
    	url += getTodayAsString();
    	url += factory.suffix;  

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
    	};

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
