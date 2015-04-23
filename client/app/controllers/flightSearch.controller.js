(function(){
	angular
		.module('zephyr')
		.controller('flightSearchController', flightSearch);

	function flightSearch(FlightFactory, $scope) {
		var vm = this;

		vm.msg = "Flight Search";
		vm.flightFactory = FlightFactory;
		

	}
})();