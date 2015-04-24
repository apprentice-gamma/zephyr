(function(){
	angular
		.module('zephyr')
		.controller('flightTracker', flightTracker);

	function flightTracker(FlightFactory, ActivityFactory, DirectionFactory, $scope, $state) {
		var vm = this;
		var second = 1000;
		var minute = second * 60;
		var showWait = false;
		var flightSoon = false;

		vm.FlightFactory = FlightFactory;
		vm.ActivityFactory = ActivityFactory;
		vm.DirectionFactory = DirectionFactory;
		vm.carCountdown = FlightFactory.calculateCountdown(DirectionFactory.drivingETA);
		vm.flightCountdown = FlightFactory.calculateCountdown(FlightFactory.connectionTime);
		vm.changeTimerClass = changeTimerClass;	

		if ($state.is('track')) {
			setInterval(intervalFunction, 5 * minute);
			showWait = FlightFactory.showWait;

			if (vm.flightCountdown <= 30) {
				flightSoon = true;
			}
		}

		function changeTimerClass(){
			if(flightSoon)
				return "timer-warning";
			else
				return "timer";
		}

		function intervalFunction(){
			console.log("I'M AN INTERVAL");
			FlightFactory.getFlightByID();
		}

	}
})();