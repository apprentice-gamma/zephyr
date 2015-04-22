(function(){
	angular
		.module('zephyr')
		.controller('flightTracker', flightTracker);

	function flightTracker(FlightFactory, ActivityFactory, $scope) {
		var vm = this;
		vm.FlightFactory = FlightFactory;
		vm.ActivityFactory = ActivityFactory;
		vm.today = new Date();
		vm.trackUTC = '2015-04-22T23:00:00.000Z';		
		vm.countdown = calculateCountdown(vm.trackUTC);
		console.log("it's the final countdown",vm.countdown)

		function calculateCountdown(input) {
			console.log("Calculation made")
			var d = new Date(input);
			var now = new Date();
			return (d.getTime() - now.getTime()) / 60000;
		}
	}
})();