(function() {
    angular
        .module('zephyr')
        .controller('mainController', mainController);

    function mainController($scope, $geolocation, DirectionFactory, FlightFactory) {
        vm = this;

        $geolocation.getCurrentPosition({timeout: 60000})
          .then(function(position) {
            vm.myPosition = position;
            console.log(vm.myPosition);
            DirectionFactory.userLocation = vm.myPosition;
            DirectionFactory.getDrivingETAData();
          });
    }
})();