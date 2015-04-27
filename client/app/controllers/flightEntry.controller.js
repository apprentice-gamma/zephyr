(function() {
    angular
        .module('zephyr')
        .controller('flightEntry', flightEntry);
    function flightEntry(FlightFactory, SpeechService, DirectionFactory, AirportFactory, AirlineFactory, $state, $geolocation, $modalStack, $http) {
        var vm = this;
        vm.FlightFactory = FlightFactory;
        vm.trackFlight = trackFlight;
        vm.SpeechService = SpeechService;
        vm.AirportFactory = AirportFactory;
        vm.airportCodes = Object.keys(AirportFactory.airports);
        vm.listenCommand = listenCommand;
        vm.airport = "";  

        if (!SpeechService.listening) {
            SpeechService.listening = true;
            SpeechService.listenForCommands();
        }

        function trackFlight(direction, controller) {
            if (direction==='arr'){
                FlightFactory.arrival = true;
                FlightFactory.showWait = false;
            }
            else if (direction === 'dep') {
                FlightFactory.arrival = false;
                FlightFactory.showWait = true;
             }

            if (FlightFactory.flight) {
                // SpeechService.speak('Tracking Flight' + FlightFactory.flight);
                FlightFactory.getFlightData(direction).then(function() {
                    if (AirlineFactory.airlines.hasOwnProperty(FlightFactory.flightComponents.airline)) {
                        SpeechService.speak('Tracking ' + AirlineFactory.airlines[FlightFactory.flightComponents.airline] + ' flight ' + FlightFactory.flightComponents.number);
                    } else {
                        SpeechService.speak('Tracking Flight' + FlightFactory.flight);
                    }
                    DirectionFactory.airport = FlightFactory.getAirportFromFlight();
                    FlightFactory.airport = DirectionFactory.airport.fsCode;
                    $geolocation.getCurrentPosition({ timeout: 60000 }) .then(function(position) {
                            console.log("MY POSITION:", position);
                            console.log(direction, FlightFactory.arrival, FlightFactory.showWait);
                            DirectionFactory.userLocation = position;
                            DirectionFactory.getDistance().then(function() {
                                FlightFactory.getTSAWaitTime().then(function() {
                                    FlightFactory.getAvgWaitTime().then(function() {
                                        $state.go('track');
                                        $modalStack.dismissAll('All Loaded Up!');
                                    }, function(error) {
                                        FlightFactory.showWait = false;
                                        $state.go('track');
                                        $modalStack.dismissAll('All Loaded Up!');
                                    });

                                }, function(error) {
                                    FlightFactory.showWait = false;
                                    FlightFactory.getAvgWaitTime().then(function() {
                                        $state.go('track');
                                        $modalStack.dismissAll('All Loaded Up!');
                                    }, function(error) {

                                    });
                                });

                            });
                        });
                });
                controller.open('sm');

            } else if(FlightFactory.airport) {
                    if (AirportFactory.airports.hasOwnProperty(FlightFactory.airport)) {
                        SpeechService.speak('Searching ' + AirportFactory.airports[FlightFactory.airport] + ' for flights ');
                    } else {
                        SpeechService.speak('Searching Airport Code ' + FlightFactory.airport + ' for flights');
                    }
                FlightFactory.findFlights(FlightFactory.airport, direction).then(function() {
                    DirectionFactory.airport = FlightFactory.getAirportFromSearch(FlightFactory.airport);
                    //SpeechService.speak('Searching Airport Code  ' + FlightFactory.airport);
                    
                    $geolocation.getCurrentPosition({ timeout: 60000}).then(function(position) {
                        console.log("MY POSITION:", position);
                        DirectionFactory.userLocation = position;
                        DirectionFactory.getDistance().then(function() {
                            FlightFactory.getTSAWaitTime().then(function() {
                                FlightFactory.getAvgWaitTime().then(function() {
                                    $state.go('results');
                                    $modalStack.dismissAll('All Loaded Up!');
                                }, function(error) {
                                    FlightFactory.showWait = false;
                                    $state.go('results');
                                    $modalStack.dismissAll('All Loaded Up!');
                                });
                            }, function(error) {
                                FlightFactory.showWait = false;
                                $state.go('results');
                                $modalStack.dismissAll('All Loaded Up!');
                            });
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