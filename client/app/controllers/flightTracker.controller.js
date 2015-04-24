(function(){
	angular
		.module('zephyr')
		.controller('flightTracker', flightTracker);

	function flightTracker(FlightFactory, ActivityFactory, DirectionFactory, $scope) {
		var vm = this;
		vm.FlightFactory = FlightFactory;
		vm.ActivityFactory = ActivityFactory;

		console.log('Times: ' + FlightFactory.connectionTime + DirectionFactory.drivingETA);
		console.log('TIME TYPES:' + typeof(FlightFactory.connectionTime) + typeof(DirectionFactory.drivingETA));
		vm.carCountdown = FlightFactory.calculateCountdown(DirectionFactory.drivingETA);
		vm.flightCountdown = FlightFactory.calculateCountdown(FlightFactory.connectionTime);

		console.log("it's the final countdown",vm.flightCountdown, vm.carCountdown);

		
	}
})();