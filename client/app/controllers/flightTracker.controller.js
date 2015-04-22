(function(){
	angular
		.module('zephyr')
		.controller('flightTracker', flightTracker);

	function flightTracker(FlightFactory, ActivityFactory) {
		var vm = this;
		vm.FlightFactory = FlightFactory;
		vm.ActivityFactory = ActivityFactory;
		vm.today = new Date();
		vm.trackUTC = '2015-04-22T23:00:00.000Z';
		var countdown = calculateCountdown(vm.trackUTC);

		function calculateCountdown(input) {
			var d = new Date(input);
			var now = new Date();
			return (d.getTime() - now.getTime()) / 60000;
		}
	}
})();