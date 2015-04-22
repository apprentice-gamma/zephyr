(function(){
	angular
		.module('zephyr')
		.controller('flightEntry', flightEntry);

	function flightEntry(FlightFactory, SpeechService, $state) {
		var vm = this;
		vm.FlightFactory = FlightFactory;
		vm.trackFlight = trackFlight;

		function trackFlight(direction) {
			FlightFactory.getFlightData(direction).then(function(){
				$state.go('track');	
			});			
		}
	}
	
})();