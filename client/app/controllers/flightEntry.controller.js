(function(){
	angular
		.module('zephyr')
		.controller('flightEntry', flightEntry);

	function flightEntry(FlightFactory, SpeechService, DirectionFactory, $state, $geolocation) {
		var vm = this;
		vm.FlightFactory = FlightFactory;
		vm.trackFlight = trackFlight;

		function trackFlight(direction, controller) {
			FlightFactory.getFlightData(direction).then(function(){
				$geolocation.getCurrentPosition({timeout: 60000})
				  .then(function(position) {
				    console.log("MY POSITION:", position);
				    DirectionFactory.userLocation = position;
				    DirectionFactory.getDrivingETAData().then(function() {
				    	$state.go('track');		
				    });
				  });				
			});	
			controller.open('sm');		
		}
	}
})();