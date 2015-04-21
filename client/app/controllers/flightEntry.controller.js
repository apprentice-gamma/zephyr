(function(){
	angular
		.module('zephyr')
		.controller('flightEntry', flightEntry);

	function flightEntry(FlightFactory, SpeechService) {
		var vm = this;
		vm.submit = submit;
		vm.FlightFactory = FlightFactory;
		
		function submit() {
			console.log(FlightFactory.flight);
			parseFlightNumber(FlightFactory.flight);
			SpeechService.speak(FlightFactory.flight);
		}

		function parseFlightNumber(flightNumber) {
			var match = /\d/.exec(flightNumber);
			var flightComponents = {};
			if (match) {
				flightComponents.airline = flightNumber.slice(0, match.index).trim();
				flightComponents.number = flightNumber.slice(match.index, flightNumber.length).trim();
				alert(flightComponents.airline + "-" + flightComponents.number);
		 	}
		 	return flightComponents;
		}
	}
})();