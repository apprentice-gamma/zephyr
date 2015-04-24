(function(){
	angular
		.module('zephyr')
		.controller('flightSearchController', flightSearch);

	function flightSearch(FlightFactory, AirportFactory, $scope, $state) {
		var vm = this;
		vm.flightFactory = FlightFactory;
		vm.airportFactory = AirportFactory;

		vm.currentPage = 1;
		vm.itemsPerPage = 5;
		vm.msg = "Flight Search";
		vm.arrival = FlightFactory.arrival;

		vm.selectFlight = selectFlight;
		vm.getAirportName = getAirportName;

		function getAirportName(airportCode) {
			console.log(AirportFactory.airports[airportCode]);
			return AirportFactory.airports[airportCode];
		}

		function selectFlight(flight) {
			FlightFactory.flightID = flight.flightID;
			FlightFactory.getConnectionTimeFromFlightList(flight);
			$state.go('track');	
		}
	}
})();