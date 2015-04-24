(function(){
	angular
		.module('zephyr')
		.controller('flightTracker', flightTracker);

	function flightTracker(FlightFactory, ActivityFactory, DirectionFactory, SpeechService, $scope, $state) {
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

			if(vm.flightCountdown > 0)
             	SpeechService.speak('ETA of flight event is about ' + Math.round(vm.flightCountdown) + ' minutes');
			if(vm.carCountdown > 0)
             	SpeechService.speak('Driving ETA to Airport is about ' + Math.round(vm.carCountdown) + ' minutes');
            
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