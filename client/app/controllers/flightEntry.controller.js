(function() {
    angular
        .module('zephyr')
        .controller('flightEntry', flightEntry);
    function flightEntry(FlightFactory, SpeechService, DirectionFactory, $state, $geolocation, $modalStack) {
        var vm = this;
        vm.FlightFactory = FlightFactory;
        vm.trackFlight = trackFlight;
        vm.SpeechService = SpeechService;
        vm.listenFlight = listenFlight;
        vm.listenCommand = listenCommand;
        vm.speechBox = speakBox;

        vm.airport = "";


        function trackFlight(direction, controller) {
            SpeechService.speak(FlightFactory.flight);

            if (FlightFactory.flight) {
                FlightFactory.getFlightData(direction).then(function() {
                    $geolocation.getCurrentPosition({
                        timeout: 60000
                    })
                        .then(function(position) {
                            console.log("MY POSITION:", position);
                            DirectionFactory.userLocation = position;
                            DirectionFactory.getDistance().then(function() {
                                $state.go('track');
                                $modalStack.dismissAll('All Loaded Up!');
                            });
                        });
                });
                controller.open('sm');
            } else {
                // alert('no flight entered');
                FlightFactory.findFlights(vm.airport, direction).then(function() {
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

		function submit() {
			parseFlightNumber(FlightFactory.flight);
			SpeechService.speak(FlightFactory.flight);
		}

		function parseFlightNumber(flightNumber) {
			var match = /\d/.exec(flightNumber);
			var flightComponents = {};
			if (match) {
				flightComponents.airline = flightNumber.slice(0, match.index).trim();
				flightComponents.number = flightNumber.slice(match.index, flightNumber.length).trim();
				alert(flightComponents.airline + "-" + flightComponents.number);
		 	}
		 	return flightComponents;
		}

        function speakBox(input) {
            SpeechService.speak(input);
        }

		function listenFlight() {
			SpeechService.listen(vm, 'test');
		}

        function listenCommand() {
            SpeechService.listenForCommands(vm);
        }
	}
})();