(function(){
	angular
		.module('zephyr')
		.controller('flightEntry', flightEntry);

	function flightEntry(FlightFactory, SpeechService) {
		var vm = this;
		vm.FlightFactory = FlightFactory;
	}
	
})();