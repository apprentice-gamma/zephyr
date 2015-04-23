(function() {
    angular
        .module('zephyr')
        .controller('mainController', mainController);

    function mainController($scope, $geolocation, DirectionFactory, FlightFactory) {
        vm = this;

        $geolocation.getCurrentPosition({timeout: 60000})
          .then(function(position) {
            console.log("MY POSITION:" + position);
            DirectionFactory.userLocation = position;
            DirectionFactory.getDrivingETAData();
          });
    }
})();