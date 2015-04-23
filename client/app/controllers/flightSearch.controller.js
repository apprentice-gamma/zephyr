(function(){
	angular
		.module('zephyr')
		.controller('flightSearchController', flightSearch);

	function flightSearch(FlightFactory, $scope, $state) {
		var vm = this;

		vm.currentPage = 1;
		vm.itemsPerPage = 5;
		vm.msg = "Flight Search";
		vm.flightFactory = FlightFactory;
		vm.arrival = FlightFactory.arrival;

		vm.selectFlight = selectFlight;

		function selectFlight(flight) {
			alert("I'm SELECTED!");
			console.log(flight);
			//$state.go('track');	
		}
	}
})();