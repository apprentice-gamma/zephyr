(function(){
	angular
		.module('zephyr')
		.factory('ActivityFactory', ActivityFactory);

	function ActivityFactory() {
		var factory = {};
			factory.activities = ['1', 'TWO', 'BANANA', 'FIVE', 'BILLION', 'DOG', 'CAT', 'BURGER'];
			factory.totalActivities = factory.activities.length;
		return factory;
	}
})();