(function() {
    angular
        .module('zephyr')
        .controller('mainController', mainController);

    function mainController($scope, $geolocation, DirectionFactory, FlightFactory) {
        vm = this;
    }
})();