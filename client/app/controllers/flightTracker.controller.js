(function(){
	angular
		.module('zephyr')
		.controller('flightTracker', flightTracker);

	function flightTracker(FlightFactory, ActivityFactory, DirectionFactory, $scope, $state) {
		var vm = this;
		var second = 1000;
		var minute = second * 60;

		vm.FlightFactory = FlightFactory;
		vm.ActivityFactory = ActivityFactory;
		vm.carCountdown = FlightFactory.calculateCountdown(DirectionFactory.drivingETA);
		vm.flightCountdown = FlightFactory.calculateCountdown(FlightFactory.connectionTime);		

		if ($state.is('track')) {
			setInterval(intervalFunction, 5 * minute);
		}

		function intervalFunction(){
			console.log("I'M AN INTERVAL");
			FlightFactory.getFlightByID();
		}

	}
})();