(function(){
	angular
		.module('zephyr')
		.controller('flightEntry', flightEntry);

	function flightEntry(FlightFactory, SpeechService, $state) {
		var vm = this;
		vm.FlightFactory = FlightFactory;
		vm.trackFlight = trackFlight;
		vm.airport = "";

		function trackFlight(direction) {
			if (FlightFactory.flight){
				FlightFactory.getFlightData(direction).then(function(){
					$state.go('track');	
				});		
			} else {
				alert('no flight entered');
				FlightFactory.findFlights(vm.airport);
			}
		}
	}
	
})();