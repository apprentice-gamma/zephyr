(function(){
	angular
		.module('zephyr')
		.controller('flightSearchController', flightSearch);

	function flightSearch(FlightFactory, $scope) {
		var vm = this;

		vm.currentPage = 1;
		vm.itemsPerPage = 5;
		vm.msg = "Flight Search";
		vm.flightFactory = FlightFactory;
		vm.arrival = FlightFactory.arrival;
		

	}
})();