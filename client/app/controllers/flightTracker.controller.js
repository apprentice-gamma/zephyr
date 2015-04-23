(function(){
	angular
		.module('zephyr')
		.controller('flightTracker', flightTracker);

	function flightTracker(FlightFactory, ActivityFactory, $scope) {
		var vm = this;
		vm.FlightFactory = FlightFactory;
		vm.ActivityFactory = ActivityFactory;
		//vm.today = new Date();	

		vm.carCountdown = calculateCountdown();
		vm.flightCountdown = calculateCountdown(FlightFactory.connectionTime);
		
		console.log("it's the final countdown",vm.flightCountdown, vm.carCountdown);

		function calculateCountdown(input) {
			console.log("Calculation made")
			var d = new Date(input);
			var now = new Date();
			return (d.getTime() - now.getTime()) / 60000;
		}
	}
})();