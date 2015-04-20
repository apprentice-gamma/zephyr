(function(){
	angular
		.module('zephyr')
		.factory('FlightFactory', FlightFactory);

	function FlightFactory() {
		var factory = {};
			factory.flight = undefined;
		return factory;
	}
})();