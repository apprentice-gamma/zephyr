(function() {
    angular
        .module('zephyr')
        .controller('mainController', mainController);

    function mainController($scope, $geolocation, DirectionFactory, FlightFactory) {
        vm = this;

        $geolocation.getCurrentPosition({
            timeout: 60000
        }).then(function(position) {
            $scope.myPosition = position;
            console.log($scope.myPosition);
            DirectionFactory.userLocation = $scope.myPosition;
            DirectionFactory.getDrivingETAData();
        });




    }
})();