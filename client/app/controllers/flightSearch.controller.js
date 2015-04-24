(function(){
	angular
		.module('zephyr')
		.controller('flightSearchController', flightSearch);

	function flightSearch(FlightFactory, AirportFactory, AirlineFactory, $scope, $state) {
		var vm = this;
		vm.flightFactory = FlightFactory;
		vm.airportFactory = AirportFactory;

		vm.currentPage = 1;
		vm.itemsPerPage = 5;
		vm.msg = "Flight Search";
		vm.arrival = FlightFactory.arrival;

		vm.selectFlight = selectFlight;
		vm.getAirportName = getAirportName;
		vm.getAirlineName = getAirlineName;

		function getAirportName(airportCode) {
			return AirportFactory.airports[airportCode];
		}

		function getAirlineName(airlineCode) {
			return AirlineFactory.airlines[airlineCode];
		}

		function selectFlight(flight) {
			FlightFactory.flightID = flight.flightID;
			FlightFactory.getConnectionTimeFromFlightList(flight);
			$state.go('track');	
		}
	}
})();