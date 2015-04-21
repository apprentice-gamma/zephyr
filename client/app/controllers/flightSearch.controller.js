(function(){
	angular
		.module('zephyr')
		.controller('flightSearch', flightSearch);

	function flightSearch(FlightFactory, $scope) {
		var vm = this;
		
		vm.dt = undefined;
		vm.minDate = null;
		vm.opened = false;
		vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		vm.format = vm.formats[0];
		
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		vm.today = today;
		vm.clear = clear;
		vm.disabled = disabled;
		vm.toggleMin = toggleMin;
		vm.open = open;

		activate();
		// ACTIVATION
		function activate() {
			vm.today();
			vm.toggleMin();
		}

		// FUNCTION DECLARATIONS
		function today() {
		   vm.dt = new Date();
		 }

		 function clear() {
		   vm.dt = null;
		 }

		 // Disable weekend selection
		 function disabled(date, mode) {
		   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		 }

		 function toggleMin() {
		   vm.minDate = vm.minDate ? null : new Date();
		 }

		 function open($event) {
		   $event.preventDefault();
		   $event.stopPropagation();

		   vm.opened = true;
		 }
	}
})();