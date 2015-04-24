(function() {
    angular
        .module('zephyr')
        .controller('flightEntry', flightEntry);
    function flightEntry(FlightFactory, SpeechService, DirectionFactory, $state, $geolocation, $modalStack, $http) {
        var vm = this;
        vm.FlightFactory = FlightFactory;
        vm.trackFlight = trackFlight;
        vm.SpeechService = SpeechService;
        vm.listenCommand = listenCommand;
        vm.airport = "";


        function trackFlight(direction, controller) {
            if (FlightFactory.flight) {
                FlightFactory.arrival = false;
                SpeechService.speak('Tracking Flight' + FlightFactory.flight);
                FlightFactory.getFlightData(direction).then(function() {
                    $geolocation.getCurrentPosition({
                        timeout: 60000
                    })
                        .then(function(position) {
                            console.log("MY POSITION:", position);
                            DirectionFactory.userLocation = position;
                            DirectionFactory.getDistance().then(function() {
                                FlightFactory.getTSAWaitTime().then(function() {
                                    FlightFactory.getAvgWaitTime().then(function() {
                                        $state.go('track');
                                        $modalStack.dismissAll('All Loaded Up!');
                                    });
                                });
                            });
                        });
                });
                controller.open('sm');

            } else if(vm.airport) {
                FlightFactory.arrival = true;
                FlightFactory.findFlights(vm.airport, direction).then(function() {
                    SpeechService.speak('Searching Airport Code  ' + vm.airport);
                    $geolocation.getCurrentPosition({
                        timeout: 60000
                    })
                        .then(function(position) {
                            console.log("MY POSITION:", position);
                            DirectionFactory.userLocation = position;
                            DirectionFactory.getDistance().then(function() {
                                $state.go('results');
                                $modalStack.dismissAll('All Loaded Up!');
                            });
                        });
                });
                controller.open('sm');
            } 
        }

        function listenCommand() {
            SpeechService.listenForCommands();
        }
	}
})();