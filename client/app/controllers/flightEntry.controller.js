(function(){
	angular
		.module('zephyr')
		.controller('flightEntry', flightEntry);

	function flightEntry(FlightFactory) {
		var vm = this;
		vm.submit = submit;
		vm.FlightFactory = FlightFactory;
		
		function submit() {
			alert(FlightFactory.flight);
		}
	}
})();